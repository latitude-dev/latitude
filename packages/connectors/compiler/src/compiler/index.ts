import { BaseNode, type TemplateNode } from '../parser/interfaces'
import { type Node, type Identifier, type SimpleCallExpression } from 'estree'
import parse from '../parser/index'
import {
  ASSIGNMENT_OPERATOR_METHODS,
  BINARY_OPERATOR_METHODS,
  MEMBER_EXPRESSION_METHOD,
  UNARY_OPERATOR_METHODS,
} from './operators'
import CompileError, { error } from '../error/error'
import errors from '../error/errors'
import Scope from './scope'

type CompilerAttrs = {
  query: string
  resolveFn: ResolveFn
  configFn: ConfigFn
  supportedMethods?: Record<string, SupportedMethod>
}
export type SupportedMethod = <T extends boolean>(
  interpolation: T,
  ...args: unknown[]
) => Promise<T extends true ? string : unknown>
export type ResolveFn = (value: unknown) => Promise<string>
export type ConfigFn = (key: string, value: unknown) => void

export class Compiler {
  private sql: string
  private supportedMethods: Record<string, SupportedMethod>
  private resolveFn: ResolveFn
  private configFn: ConfigFn

  private varStash: unknown[]

  private readFromStash(index: number): unknown {
    return this.varStash[index]
  }

  private addToStash(value: unknown): number {
    this.varStash.push(value)
    return this.varStash.length - 1
  }

  private modifyStash(index: number, value: unknown): void {
    this.varStash[index] = value
  }

  constructor({
    query,
    resolveFn,
    configFn,
    supportedMethods = {},
  }: CompilerAttrs) {
    this.sql = query
    this.resolveFn = resolveFn
    this.configFn = configFn
    this.supportedMethods = supportedMethods

    this.varStash = []
  }

  async compile(): Promise<string> {
    const fragment = parse(this.sql)
    const localScope = new Scope(
      this.readFromStash.bind(this),
      this.addToStash.bind(this),
      this.modifyStash.bind(this),
    )
    const compiledSql = (await this.parseBaseNode(fragment, localScope))
      .replace(/ +/g, ' ') // Remove extra spaces
      .trim() // Remove leading and trailing spaces

    return compiledSql
  }

  private parseBaseNode = async (
    node: BaseNode,
    localScope: Scope,
  ): Promise<string> => {
    if (!node) return ''

    if (node.type === 'Fragment') {
      return this.parseBaseNodeChildren(node.children, localScope)
    }

    if (node.type === 'Comment') {
      return node.raw
    }

    if (node.type === 'Text') {
      return node.raw
    }

    if (node.type === 'MustacheTag') {
      return await this.parseLogicNode(node.expression, localScope)
    }

    if (node.type === 'ConstTag') {
      // Only allow equal expressions to define constants
      const expression = node.expression
      if (
        expression.type !== 'AssignmentExpression' ||
        expression.operator !== '=' ||
        expression.left.type !== 'Identifier'
      ) {
        this.baseNodeError(errors.invalidConstantDefinition, node)
      }

      const constName = (expression.left as Identifier).name
      const constValue = await this.resolveLogicNodeExpression(
        expression.right,
        localScope,
      )
      if (localScope.exists(constName)) {
        this.baseNodeError(errors.variableAlreadyDeclared(constName), node)
      }
      localScope.defineConst(constName, constValue)
      return ''
    }

    if (node.type === 'ConfigTag') {
      const expression = node.expression
      if (
        expression.type !== 'AssignmentExpression' ||
        expression.operator !== '=' ||
        expression.left.type !== 'Identifier'
      ) {
        this.baseNodeError(errors.invalidConfigDefinition, node)
      }

      const optionKey = (expression.left as Identifier).name
      const optionValue = await this.resolveLogicNodeExpression(
        expression.right,
        localScope,
      )
      try {
        this.configFn(optionKey, optionValue)
      } catch (error: unknown) {
        const errorMessage = (error as Error).message
        this.baseNodeError(
          errors.configDefinitionFailed(optionKey, errorMessage),
          node,
        )
      }
      return ''
    }

    if (node.type === 'IfBlock') {
      return (await this.resolveLogicNodeExpression(
        node.expression,
        localScope,
      ))
        ? this.parseBaseNodeChildren(node.children, localScope)
        : await this.parseBaseNode(node.else, localScope)
    }

    if (node.type === 'ElseBlock') {
      return this.parseBaseNodeChildren(node.children, localScope)
    }

    if (node.type === 'EachBlock') {
      const iterableElement = await this.resolveLogicNodeExpression(
        node.expression,
        localScope,
      )
      if (!Array.isArray(iterableElement) || !iterableElement.length) {
        return await this.parseBaseNode(node.else, localScope)
      }

      const contextVar = node.context.name
      const indexVar = node.index
      if (localScope.exists(contextVar)) {
        this.baseNodeError(errors.variableAlreadyDeclared(contextVar), node)
      }
      if (indexVar && localScope.exists(indexVar)) {
        this.baseNodeError(errors.variableAlreadyDeclared(indexVar), node)
      }

      const parsedChildren: string[] = []
      for (let i = 0; i < iterableElement.length; i++) {
        const element = iterableElement[i]
        if (indexVar) localScope.set(indexVar, i)
        localScope.set(contextVar, element)
        parsedChildren.push(
          await this.parseBaseNodeChildren(node.children, localScope),
        )
      }
      return parsedChildren.join('') || ''
    }

    throw this.baseNodeError(errors.unsupportedBaseNodeType(node.type), node)
  }

  private parseLogicNode = async (
    node: Node,
    localScope: Scope,
  ): Promise<string> => {
    if (node.type === 'AssignmentExpression') {
      await this.resolveLogicNodeExpression(node, localScope)
      return ''
    }

    if (node.type === 'CallExpression') {
      return await this.handleFunction(
        node as SimpleCallExpression,
        true,
        localScope,
      )
    }

    const value = await this.resolveLogicNodeExpression(node, localScope)
    const resolvedValue = await this.resolveFn(value)

    return resolvedValue
  }

  private resolveLogicNodeExpression = async (
    node: Node,
    localScope: Scope,
  ): Promise<unknown> => {
    if (node.type === 'Literal') {
      return node.value
    }

    if (node.type === 'Identifier') {
      if (!localScope.exists(node.name)) {
        this.expressionError(errors.variableNotDeclared(node.name), node)
      }
      return localScope.get(node.name)
    }

    if (node.type === 'ObjectExpression') {
      const resolvedObject: { [key: string]: any } = {}
      for (const prop of node.properties) {
        if (prop.type !== 'Property') {
          throw this.expressionError(errors.invalidObjectKey, node)
        }
        const key = prop.key as Identifier
        const value = await this.resolveLogicNodeExpression(
          prop.value,
          localScope,
        )
        resolvedObject[key.name] = value
      }
      return resolvedObject
    }

    if (node.type === 'ArrayExpression') {
      return await Promise.all(
        node.elements.map((element) =>
          element ? this.resolveLogicNodeExpression(element, localScope) : null,
        ),
      )
    }

    if (node.type === 'SequenceExpression') {
      return await Promise.all(
        node.expressions.map((expression) =>
          this.resolveLogicNodeExpression(expression, localScope),
        ),
      )
    }

    if (node.type === 'LogicalExpression' || node.type === 'BinaryExpression') {
      const binaryOperator = node.operator
      if (!(binaryOperator in BINARY_OPERATOR_METHODS)) {
        this.expressionError(errors.unsupportedOperator(binaryOperator), node)
      }
      const leftOperand = await this.resolveLogicNodeExpression(
        node.left,
        localScope,
      )
      const rightOperand = await this.resolveLogicNodeExpression(
        node.right,
        localScope,
      )
      return BINARY_OPERATOR_METHODS[binaryOperator]?.(
        leftOperand,
        rightOperand,
      )
    }

    if (node.type === 'UnaryExpression') {
      const unaryOperator = node.operator
      if (!(unaryOperator in UNARY_OPERATOR_METHODS)) {
        this.expressionError(errors.unsupportedOperator(unaryOperator), node)
      }

      const unaryArgument = await this.resolveLogicNodeExpression(
        node.argument,
        localScope,
      )
      const unaryPrefix = node.prefix
      return UNARY_OPERATOR_METHODS[unaryOperator]?.(unaryArgument, unaryPrefix)
    }

    if (node.type === 'MemberExpression') {
      const object = (await this.resolveLogicNodeExpression(
        node.object,
        localScope,
      )) as {
        [key: string]: any
      }
      const property = node.computed
        ? ((await this.resolveLogicNodeExpression(
            node.property,
            localScope,
          )) as string)
        : (node.property as Identifier).name

      const isOptional = node.optional
      if (object == null && isOptional) return undefined

      return MEMBER_EXPRESSION_METHOD(object, property)
    }

    if (node.type === 'AssignmentExpression') {
      const assignmentOperator = node.operator
      if (!(assignmentOperator in ASSIGNMENT_OPERATOR_METHODS)) {
        this.expressionError(
          errors.unsupportedOperator(assignmentOperator),
          node,
        )
      }
      const assignmentMethod = ASSIGNMENT_OPERATOR_METHODS[assignmentOperator]!

      const assignmentValue = await this.resolveLogicNodeExpression(
        node.right,
        localScope,
      )

      if (node.left.type === 'Identifier') {
        const assignedVariableName = (node.left as Identifier).name

        if (localScope.isConst(assignedVariableName)) {
          this.expressionError(errors.constantReassignment, node)
        }

        if (
          assignmentOperator != '=' &&
          !localScope.exists(assignedVariableName)
        ) {
          this.expressionError(
            errors.variableNotDeclared(assignedVariableName),
            node,
          )
        }

        const updatedValue = assignmentMethod(
          localScope.exists(assignedVariableName)
            ? localScope.get(assignedVariableName)
            : undefined,
          assignmentValue,
        )

        localScope.set(assignedVariableName, updatedValue)
        return updatedValue
      }
      if (node.left.type === 'MemberExpression') {
        const object = (await this.resolveLogicNodeExpression(
          node.left.object,
          localScope,
        )) as { [key: string]: any }

        const property = node.left.computed
          ? ((await this.resolveLogicNodeExpression(
              node.left.property,
              localScope,
            )) as string)
          : (node.left.property as Identifier).name

        if (assignmentOperator != '=' && !(property in object)) {
          this.expressionError(errors.propertyNotExists(property), node)
        }

        const originalValue = object[property]
        const updatedValue = assignmentMethod(originalValue, assignmentValue)
        object[property] = updatedValue
        return updatedValue
      }

      this.expressionError(errors.invalidAssignment, node)
    }

    if (node.type === 'UpdateExpression') {
      const updateOperator = node.operator
      if (!['++', '--'].includes(updateOperator)) {
        this.expressionError(errors.unsupportedOperator(updateOperator), node)
      }

      if (node.argument.type == 'Identifier') {
        const updatedVariableName = (node.argument as Identifier).name
        if (!localScope.exists(updatedVariableName)) {
          this.expressionError(
            errors.variableNotDeclared(updatedVariableName),
            node,
          )
        }
        if (localScope.isConst(updatedVariableName)) {
          this.expressionError(errors.constantReassignment, node)
        }
        const originalValue = localScope.get(updatedVariableName)
        if (typeof originalValue !== 'number') {
          this.expressionError(
            errors.invalidUpdate(updateOperator, typeof originalValue),
            node,
          )
        }
        const updatedValue =
          updateOperator === '++'
            ? (originalValue as number) + 1
            : (originalValue as number) - 1
        localScope.set(updatedVariableName, updatedValue)
        return node.prefix ? updatedValue : originalValue
      }
      if (node.argument.type == 'MemberExpression') {
        const object = (await this.resolveLogicNodeExpression(
          node.argument.object,
          localScope,
        )) as { [key: string]: any }

        const property = node.argument.computed
          ? ((await this.resolveLogicNodeExpression(
              node.argument.property,
              localScope,
            )) as string)
          : (node.argument.property as Identifier).name

        const originalValue = object[property]
        const updatedValue =
          updateOperator === '++'
            ? (originalValue as number) + 1
            : (originalValue as number) - 1
        object[property] = updatedValue
        return node.prefix ? updatedValue : originalValue
      }

      this.expressionError(errors.invalidAssignment, node)
    }

    if (node.type === 'ConditionalExpression') {
      const test = await this.resolveLogicNodeExpression(node.test, localScope)
      const consequent = await this.resolveLogicNodeExpression(
        node.consequent,
        localScope,
      )
      const alternate = await this.resolveLogicNodeExpression(
        node.alternate,
        localScope,
      )
      return test ? consequent : alternate
    }

    if (node.type === 'CallExpression') {
      return await this.handleFunction(node, false, localScope)
    }

    if (node.type === 'ChainExpression') {
      return await this.resolveLogicNodeExpression(node.expression, localScope)
    }

    if (node.type === 'NewExpression') {
      throw this.expressionError(errors.unsupportedOperator('new'), node)
    }

    throw this.expressionError(
      errors.unsupportedExpressionType(node.type),
      node,
    )
  }

  private parseBaseNodeChildren = async (
    children: TemplateNode[] | undefined,
    localScope: Scope,
  ): Promise<string> => {
    const parsedChildren: string[] = []
    const childrenScope = localScope.copy()
    for (const child of children || []) {
      const parsedChild = await this.parseBaseNode(child, childrenScope)
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
      source: this.sql || '',
      start: node.start || 0,
      end: node.end || undefined,
    })
  }

  private expressionError(
    { code, message }: { code: string; message: string },
    node: Node,
  ): never {
    const source = (node.loc?.source ?? this.sql)!.split('\n')
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
      source: this.sql || '',
      start,
      end,
    })
  }

  private handleFunction = async <T extends boolean>(
    node: SimpleCallExpression,
    interpolation: T,
    localScope: Scope,
  ): Promise<T extends true ? string : unknown> => {
    if (node.callee.type === 'Identifier') {
      return await this.handleSupportedMethod(node, interpolation, localScope)
    }

    if (node.callee.type === 'MemberExpression') {
      const result = await this.handleMethodFromCallExpression(node, localScope)
      if (!interpolation) return result as T extends true ? string : unknown
      if (result === undefined) return '' // Method was a void
      return await this.resolveFn(result)
    }

    this.expressionError(errors.unknownFunction(''), node)
  }

  private handleSupportedMethod = async <T extends boolean>(
    node: SimpleCallExpression,
    interpolation: T,
    localScope: Scope,
  ): Promise<T extends true ? string : unknown> => {
    const methodName = (node.callee as Identifier).name
    if (!(methodName in this.supportedMethods)) {
      this.expressionError(errors.unknownFunction(methodName), node)
    }
    const method = this.supportedMethods[methodName]! as SupportedMethod
    const args: unknown[] = []
    for (const arg of node.arguments) {
      args.push(await this.resolveLogicNodeExpression(arg, localScope))
    }
    try {
      const returnedValue = (await method(
        interpolation,
        ...args,
      )) as T extends true ? string : unknown
      if (interpolation && typeof returnedValue !== 'string') {
        this.expressionError(errors.invalidFunctionResultInterpolation, node)
      }
      return returnedValue
    } catch (error: unknown) {
      if (error instanceof CompileError) throw error
      this.expressionError(
        errors.namedFunctionCallError(methodName, error),
        node,
      )
    }
  }

  private handleMethodFromCallExpression = async (
    node: SimpleCallExpression,
    localScope: Scope,
  ): Promise<unknown> => {
    const method = await this.resolveLogicNodeExpression(
      node.callee,
      localScope,
    )
    const args: unknown[] = []
    for (const arg of node.arguments) {
      args.push(await this.resolveLogicNodeExpression(arg, localScope))
    }

    if (typeof method !== 'function') {
      this.expressionError(errors.notAFunction(typeof method), node)
    }

    try {
      return await method(...args)
    } catch (error: unknown) {
      if (error instanceof CompileError) throw error
      this.expressionError(errors.unnamedFunctionCallError(error), node)
    }
  }
}
