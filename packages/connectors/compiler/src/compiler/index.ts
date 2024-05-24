import type { BaseNode, TemplateNode } from '../parser/interfaces'
import type { Node, Identifier } from 'estree'
import type { CompileContext, CompilerAttrs } from './types'
import parse from '../parser/index'
import { error } from '../error/error'
import errors from '../error/errors'
import Scope from './scope'
import { NodeType } from './logic/types'
import { resolveLogicNode } from './logic'

export class Compiler {
  private context: CompileContext

  constructor({
    query,
    resolveFn,
    configFn,
    supportedMethods = {},
  }: CompilerAttrs) {
    this.context = {
      sql: query,
      supportedMethods,
      resolveFn,
      configFn,
    }
  }

  /**
   * Resolves every block, expression, and function inside the SQL and returns the final query.
   *
   * Note: Compiling a query may take time in some cases, as some queries may contain expensive
   * functions that need to be resolved at runtime.
   */
  async compileSQL(): Promise<string> {
    const fragment = parse(this.context.sql)
    const localScope = new Scope()
    const compiledSql = (await this.resolveBaseNode(fragment, localScope))
      .replace(/ +/g, ' ') // Remove extra spaces
      .trim() // Remove leading and trailing spaces

    return compiledSql
  }

  /**
   * Given a base node, returns the string that will replace it in the final SQL
   */
  private resolveBaseNode = async (
    baseNode: BaseNode,
    localScope: Scope,
  ): Promise<string> => {
    if (!baseNode) return ''

    if (baseNode.type === 'Fragment') {
      // Parent node, only one of its kind
      return this.resolveBaseNodeChildren(baseNode.children, localScope)
    }

    if (baseNode.type === 'Comment') {
      return baseNode.raw
    }

    if (baseNode.type === 'Text') {
      return baseNode.raw
    }

    if (baseNode.type === 'MustacheTag') {
      const expression = baseNode.expression

      // Some node expressions do not inject any value into the SQL
      const silentExpressions = [NodeType.AssignmentExpression]

      if (silentExpressions.includes(expression.type as NodeType)) {
        await resolveLogicNode({
          node: expression,
          scope: localScope,
          raiseError: this.expressionError.bind(this),
          supportedMethods: this.context.supportedMethods,
          willInterpolate: false,
        })
        return ''
      }

      if (
        // If the expression is a call to a supported method, the result WILL BE INTERPOLATED
        expression.type === NodeType.CallExpression &&
        expression.callee.type === NodeType.Identifier &&
        expression.callee.name in this.context.supportedMethods
      ) {
        return (await resolveLogicNode({
          node: expression,
          scope: localScope,
          raiseError: this.expressionError.bind(this),
          supportedMethods: this.context.supportedMethods,
          willInterpolate: true,
        })) as string
      }

      const value = await resolveLogicNode({
        node: expression,
        scope: localScope,
        raiseError: this.expressionError.bind(this),
        supportedMethods: this.context.supportedMethods,
        willInterpolate: false,
      })
      const resolvedValue = await this.context.resolveFn(value)

      return resolvedValue
    }

    if (baseNode.type === 'ConstTag') {
      // Only allow equal expressions to define constants
      const expression = baseNode.expression
      if (
        expression.type !== 'AssignmentExpression' ||
        expression.operator !== '=' ||
        expression.left.type !== 'Identifier'
      ) {
        this.baseNodeError(errors.invalidConstantDefinition, baseNode)
      }

      const constName = (expression.left as Identifier).name
      const constValue = await resolveLogicNode({
        node: expression.right,
        scope: localScope,
        raiseError: this.expressionError.bind(this),
        supportedMethods: this.context.supportedMethods,
        willInterpolate: false,
      })
      if (localScope.exists(constName)) {
        this.baseNodeError(errors.variableAlreadyDeclared(constName), baseNode)
      }
      localScope.defineConst(constName, constValue)
      return ''
    }

    if (baseNode.type === 'ConfigTag') {
      const expression = baseNode.expression
      if (
        expression.type !== 'AssignmentExpression' ||
        expression.operator !== '=' ||
        expression.left.type !== 'Identifier'
      ) {
        this.baseNodeError(errors.invalidConfigDefinition, baseNode)
      }

      const optionKey = (expression.left as Identifier).name
      const optionValue = await resolveLogicNode({
        node: expression.right,
        scope: localScope,
        raiseError: this.expressionError.bind(this),
        supportedMethods: this.context.supportedMethods,
        willInterpolate: false,
      })
      try {
        this.context.configFn(optionKey, optionValue)
      } catch (error: unknown) {
        const errorMessage = (error as Error).message
        this.baseNodeError(
          errors.configDefinitionFailed(optionKey, errorMessage),
          baseNode,
        )
      }

      return ''
    }

    if (baseNode.type === 'IfBlock') {
      const condition = await resolveLogicNode({
        node: baseNode.expression,
        scope: localScope,
        raiseError: this.expressionError.bind(this),
        supportedMethods: this.context.supportedMethods,
        willInterpolate: false,
      })
      return condition
        ? this.resolveBaseNodeChildren(baseNode.children, localScope)
        : await this.resolveBaseNode(baseNode.else, localScope)
    }

    if (baseNode.type === 'ElseBlock') {
      return this.resolveBaseNodeChildren(baseNode.children, localScope)
    }

    if (baseNode.type === 'EachBlock') {
      const iterableElement = await resolveLogicNode({
        node: baseNode.expression,
        scope: localScope,
        raiseError: this.expressionError.bind(this),
        supportedMethods: this.context.supportedMethods,
        willInterpolate: false,
      })
      if (!Array.isArray(iterableElement) || !iterableElement.length) {
        return await this.resolveBaseNode(baseNode.else, localScope)
      }

      const contextVar = baseNode.context.name
      const indexVar = baseNode.index
      if (localScope.exists(contextVar)) {
        this.baseNodeError(errors.variableAlreadyDeclared(contextVar), baseNode)
      }
      if (indexVar && localScope.exists(indexVar)) {
        this.baseNodeError(errors.variableAlreadyDeclared(indexVar), baseNode)
      }

      const parsedChildren: string[] = []
      for (let i = 0; i < iterableElement.length; i++) {
        const element = iterableElement[i]
        if (indexVar) localScope.set(indexVar, i)
        localScope.set(contextVar, element)
        parsedChildren.push(
          await this.resolveBaseNodeChildren(baseNode.children, localScope),
        )
      }
      return parsedChildren.join('') || ''
    }

    throw this.baseNodeError(
      errors.unsupportedBaseNodeType(baseNode.type),
      baseNode,
    )
  }

  private resolveBaseNodeChildren = async (
    children: TemplateNode[] | undefined,
    localScope: Scope,
  ): Promise<string> => {
    const parsedChildren: string[] = []
    const childrenScope = localScope.copy() // All children share the same scope
    for (const child of children || []) {
      const parsedChild = await this.resolveBaseNode(child, childrenScope)
      parsedChildren.push(parsedChild)
    }
    return parsedChildren.join('') || ''
  }

  private baseNodeError(
    { code, message }: { code: string; message: string },
    node: BaseNode,
  ): never {
    error(message, {
      name: 'CompileError',
      code,
      source: this.context.sql || '',
      start: node.start || 0,
      end: node.end || undefined,
    })
  }

  private expressionError(
    { code, message }: { code: string; message: string },
    node: Node,
  ): never {
    const source = (node.loc?.source ?? this.context.sql)!.split('\n')
    const start =
      source
        .slice(0, node.loc?.start.line! - 1)
        .reduce((acc, line) => acc + line.length + 1, 0) +
      node.loc?.start.column!
    const end =
      source
        .slice(0, node.loc?.end.line! - 1)
        .reduce((acc, line) => acc + line.length + 1, 0) + node.loc?.end.column!

    error(message, {
      name: 'CompileError',
      code,
      source: this.context.sql || '',
      start,
      end,
    })
  }
}
