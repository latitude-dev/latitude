/* eslint no-case-declarations: 0 */
/* eslint no-prototype-builtins: 0 */

// TODO: Carlos is changing all of this so this Lint rules will not be necessary
import type QueryResult from '@latitude-sdk/query_result'
import {
  type QueryRequest,
  type QueryParams,
  type CompiledQuery,
  type ResolvedParam,
  ConnectorError,
} from './types'
import { type Ast, type TemplateNode } from 'svelte/types/compiler/interfaces'
import {
  type Node,
  type Identifier,
  type BaseNodeWithoutComments,
  type SimpleCallExpression,
} from 'estree'
import { parse } from 'svelte/compiler'
import {
  ASSIGNMENT_OPERATOR_METHODS,
  BINARY_OPERATOR_METHODS,
  MEMBER_EXPRESSION_METHOD,
  UNARY_OPERATOR_METHODS,
  CAST_METHODS,
} from './operators'

type ResolveFn = (
  name: string | undefined,
  value: unknown,
  resolvedParam: ResolvedParam[],
) => ResolvedParam
type ReadQueryFn = (queryPath: string) => string | undefined
type RunQueryFn = (compiledQuery: CompiledQuery) => Promise<QueryResult>

type ConnectorFns = {
  resolveFn: ResolveFn
  readQueryFn: ReadQueryFn
  runQueryFn: RunQueryFn
}

type CompileParams = ConnectorFns & {
  queryRequest: QueryRequest
}

type CompilerAttrs = ConnectorFns & {
  params: QueryParams
  compiledQueryNames: string[]
  resolvedParams: ResolvedParam[]
  varStash: unknown[]
}

export function compile({
  queryRequest,
  resolveFn,
  readQueryFn,
  runQueryFn,
}: CompileParams): Promise<CompiledQuery> {
  const { queryPath, params } = queryRequest
  const compiler = new Compiler({
    params: params ?? {},
    resolveFn,
    readQueryFn,
    runQueryFn,
    compiledQueryNames: [],
    resolvedParams: [],
    varStash: [],
  })
  return compiler.compile(queryPath)
}

class Scope {
  private consts: Record<string, number> = {}
  private vars: Record<string, number> = {}

  constructor(
    private readFromStash: (index: number) => unknown,
    private addToStash: (value: unknown) => number,
    private modifyStash: (index: number, value: unknown) => void,
  ) {}

  exists(name: string): boolean {
    return name in this.consts || name in this.vars
  }

  isConst(name: string): boolean {
    return name in this.consts
  }

  get(name: string): unknown {
    const index = this.consts[name] ?? this.vars[name] ?? undefined
    if (index === undefined) throw new Error(`Variable ${name} does not exist`)
    return this.readFromStash(index)
  }

  defineConst(name: string, value: unknown): void {
    if (this.exists(name)) throw new Error(`Variable ${name} already exists`)
    this.consts[name] = this.addToStash(value)
  }

  set(name: string, value: unknown): void {
    if (this.isConst(name)) throw new Error(`Variable ${name} is a constant`)
    if (!this.exists(name)) {
      this.vars[name] = this.addToStash(value)
      return
    }
    const index = this.vars[name]!
    this.modifyStash(index, value)
  }

  copy(): Scope {
    const scope = new Scope(
      this.readFromStash,
      this.addToStash,
      this.modifyStash,
    )
    scope.consts = { ...this.consts }
    scope.vars = { ...this.vars }
    return scope
  }
}

class Compiler {
  private sql?: string
  private params: QueryParams

  private resolveFn: ResolveFn
  private readQueryFn: ReadQueryFn
  private runQueryFn: RunQueryFn

  private resolvedParams: ResolvedParam[]
  private compiledQueryNames: string[]

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
    params,
    resolveFn,
    readQueryFn,
    runQueryFn,
    compiledQueryNames,
    resolvedParams,
    varStash,
  }: CompilerAttrs) {
    this.params = params
    this.resolveFn = resolveFn
    this.readQueryFn = readQueryFn
    this.runQueryFn = runQueryFn

    this.resolvedParams = resolvedParams
    this.compiledQueryNames = compiledQueryNames

    this.varStash = varStash
  }

  resolve(value: unknown, name?: string): string {
    const resolvedParam = this.resolveFn(name, value, this.resolvedParams)

    if (
      !this.resolvedParams.some(
        (param) =>
          param.name === resolvedParam.name &&
          param.value === resolvedParam.value &&
          param.resolvedAs === resolvedParam.resolvedAs,
      )
    ) {
      this.resolvedParams.push(resolvedParam)
    }

    return resolvedParam.resolvedAs
  }

  async compile(queryName: string): Promise<CompiledQuery> {
    const fullQueryName = queryName.endsWith('.sql')
      ? queryName
      : `${queryName}.sql`
    if (this.compiledQueryNames.includes(fullQueryName)) {
      throw new Error(`Query ${fullQueryName} has already been compiled`)
    }
    this.compiledQueryNames.push(fullQueryName)
    const query = this.readQueryFn(fullQueryName)
    if (!query) {
      throw new SyntaxError(`Query ${fullQueryName} does not exist`, {
        query: '',
      })
    }
    this.sql = query!

    const ast = this.parseQuery(this.sql)
    const localScope = new Scope(
      this.readFromStash.bind(this),
      this.addToStash.bind(this),
      this.modifyStash.bind(this),
    )
    const compiledSql = (await this.parseNode(ast!.html, localScope))
      .replace(/\n/g, ' ') // Compile into a single line
      .replace(/\s+/g, ' ') // Remove extra spaces
      .trim() // Remove leading and trailing spaces

    return { sql: compiledSql, params: this.resolvedParams }
  }

  private parseQuery = (query: string): Ast => {
    try {
      return parse(query)
    } catch (error: unknown) {
      const compileError = error as ICompileError
      if (compileError.code === 'parse-error') {
        throw new SyntaxError(compileError.message, {
          query,
          pos: {
            start: {
              line: compileError.start?.line ?? 0,
              column: compileError.start?.column ?? 0,
            },
            end: {
              line: compileError.end?.line ?? 0,
              column: compileError.end?.column ?? 0,
            },
          },
        })
      }
      throw error
    }
  }

  private syntaxError = (node: BaseNodeWithoutComments, message: string) => {
    return new SyntaxError(message, {
      query: this.sql ?? '',
      pos: {
        start: {
          line: node.loc?.start.line ?? 0,
          column: node.loc?.start.column ?? 0,
        },
        end: {
          line: node.loc?.end.line ?? 0,
          column: node.loc?.end.column ?? 0,
        },
      },
    })
  }

  private parseNode = async (
    node: TemplateNode | Node,
    localScope: Scope,
  ): Promise<string> => {
    if (!node) return ''

    switch (node.type) {
      case 'Fragment':
        return this.parseNodeChildren(node.children, localScope)

      case 'Comment':
        return ''

      case 'Text':
        return node.raw

      case 'MustacheTag':
        return await this.parseNode(node.expression, localScope)

      case 'ConstTag':
        // Only allow equal expressions to define constants
        if (node.expression.type !== 'AssignmentExpression')
          throw this.syntaxError(
            node.expression,
            'Constant definitions must assign a value',
          )
        if (node.expression.operator !== '=')
          throw this.syntaxError(
            node.expression,
            'Constant definitions must use the = operator',
          )
        if (node.expression.left.type !== 'Identifier')
          throw this.syntaxError(
            node.expression,
            'Constant definitions must have an identifier on the left side',
          )
        const constName = (node.expression.left as Identifier).name
        const constValue = await this.resolveNodeExpression(
          node.expression.right,
          localScope,
        )
        if (localScope.exists(constName))
          throw this.syntaxError(
            node.expression,
            `Variable '${constName}' already exists`,
          )
        localScope.defineConst(constName, constValue)
        return ''

      case 'IfBlock':
        return (await this.resolveNodeExpression(node.expression, localScope))
          ? this.parseNodeChildren(node.children, localScope)
          : await this.parseNode(node.else, localScope)

      case 'ElseBlock':
        return this.parseNodeChildren(node.children, localScope)

      case 'EachBlock':
        const iterableElement = await this.resolveNodeExpression(
          node.expression,
          localScope,
        )
        if (!Array.isArray(iterableElement) || !iterableElement.length) {
          return await this.parseNode(node.else, localScope)
        }

        const contextVar = node.context.name
        const indexVar = node.index
        if (localScope.exists(contextVar)) {
          throw this.syntaxError(
            node.context,
            `Variable '${contextVar}' already exists`,
          )
        }
        if (indexVar && localScope.exists(indexVar)) {
          throw this.syntaxError(
            node.index,
            `Variable '${indexVar}' already exists`,
          )
        }

        const parsedChildren: string[] = []
        for (let i = 0; i < iterableElement.length; i++) {
          const element = iterableElement[i]
          if (indexVar) localScope.set(indexVar, i)
          localScope.set(contextVar, element)
          parsedChildren.push(
            await this.parseNodeChildren(node.children, localScope),
          )
        }
        return parsedChildren.join('') || ''

      case 'CallExpression':
        return (await this.handleFunction(
          node as SimpleCallExpression,
          true,
          localScope,
        )) as string

      case 'AssignmentExpression':
        await this.resolveNodeExpression(node as Node, localScope)
        return ''

      case 'Literal':
      case 'Identifier':
      case 'BinaryExpression':
      case 'LogicalExpression':
      case 'UnaryExpression':
      case 'UpdateExpression':
      case 'MemberExpression':
      case 'ArrayExpression':
      case 'ObjectExpression':
      case 'ConditionalExpression':
      case 'NewExpression':
      case 'SequenceExpression':
        const value = await this.resolveNodeExpression(node as Node, localScope)
        return this.resolve(value)

      default:
        throw this.syntaxError(node, `Unsupported node type: ${node.type}`)
    }
  }

  private resolveNodeExpression = async (
    node: Node,
    localScope: Scope,
  ): Promise<unknown> => {
    switch (node.type) {
      case 'Literal':
        return node.value

      case 'Identifier':
        if (!localScope.exists(node.name)) {
          throw this.syntaxError(node, `Undefined variable: ${node.name}`)
        }
        return localScope.get(node.name)

      case 'ObjectExpression':
        const resolvedObject: { [key: string]: any } = {}
        for (const prop of node.properties) {
          if (prop.type !== 'Property') {
            throw this.syntaxError(
              node,
              'Object definition can only contain properties',
            )
          }
          const key = prop.key as Identifier
          const value = await this.resolveNodeExpression(prop.value, localScope)
          resolvedObject[key.name] = value
        }
        return resolvedObject

      case 'ArrayExpression':
        return await Promise.all(
          node.elements.map((element) =>
            element ? this.resolveNodeExpression(element, localScope) : null,
          ),
        )

      case 'SequenceExpression':
        return await Promise.all(
          node.expressions.map((expression) =>
            this.resolveNodeExpression(expression, localScope),
          ),
        )

      case 'BinaryExpression':
      case 'LogicalExpression':
        const binaryOperator = node.operator
        if (!BINARY_OPERATOR_METHODS.hasOwnProperty(binaryOperator))
          throw this.syntaxError(
            node,
            `Unsupported operator: ${binaryOperator}`,
          )

        const leftOperand = await this.resolveNodeExpression(
          node.left,
          localScope,
        )
        const rightOperand = await this.resolveNodeExpression(
          node.right,
          localScope,
        )
        return BINARY_OPERATOR_METHODS[binaryOperator]?.(
          leftOperand,
          rightOperand,
        )

      case 'UnaryExpression':
        const unaryOperator = node.operator
        if (!UNARY_OPERATOR_METHODS.hasOwnProperty(unaryOperator)) {
          throw this.syntaxError(node, `Unsupported operator: ${unaryOperator}`)
        }

        const unaryArgument = await this.resolveNodeExpression(
          node.argument,
          localScope,
        )
        const unaryPrefix = node.prefix
        return UNARY_OPERATOR_METHODS[unaryOperator]?.(
          unaryArgument,
          unaryPrefix,
        )

      case 'AssignmentExpression':
        const assignedVariableName = (node.left as Identifier).name
        let assignedValue = await this.resolveNodeExpression(
          node.right,
          localScope,
        )
        const assignmentOperator = node.operator

        if (assignmentOperator != '=') {
          if (!ASSIGNMENT_OPERATOR_METHODS.hasOwnProperty(assignmentOperator)) {
            throw this.syntaxError(
              node,
              `Unsupported operator: ${assignmentOperator}`,
            )
          }
          if (!localScope.exists(assignedVariableName)) {
            throw this.syntaxError(
              node,
              `Undefined variable: ${assignedVariableName}`,
            )
          }
          assignedValue = ASSIGNMENT_OPERATOR_METHODS[assignmentOperator]?.(
            localScope.get(assignedVariableName),
            assignedValue,
          )
        }
        if (localScope.isConst(assignedVariableName)) {
          throw this.syntaxError(
            node,
            `Cannot reassign constant: ${assignedVariableName}`,
          )
        }
        localScope.set(assignedVariableName, assignedValue)
        return assignedValue

      case 'UpdateExpression':
        const updateOperator = node.operator
        if (!['++', '--'].includes(updateOperator)) {
          throw this.syntaxError(
            node,
            `Unsupported operator: ${updateOperator}`,
          )
        }
        const updatedVariableName = (node.argument as Identifier).name
        if (!localScope.exists(updatedVariableName)) {
          throw this.syntaxError(
            node,
            `Undefined variable: ${updatedVariableName}`,
          )
        }
        if (localScope.isConst(updatedVariableName)) {
          throw this.syntaxError(
            node,
            `Cannot update constant: ${updatedVariableName}`,
          )
        }
        const originalValue = localScope.get(updatedVariableName)
        const updatedValue =
          updateOperator === '++'
            ? (originalValue as number) + 1
            : (originalValue as number) - 1
        localScope.set(updatedVariableName, updatedValue)
        return node.prefix ? updatedValue : originalValue

      case 'MemberExpression':
        const object = (await this.resolveNodeExpression(
          node.object,
          localScope,
        )) as {
          [key: string]: any
        }
        const property = node.computed
          ? await this.resolveNodeExpression(node.property, localScope)
          : (node.property as Identifier).name
        return MEMBER_EXPRESSION_METHOD(object, property)

      case 'ConditionalExpression':
        const test = await this.resolveNodeExpression(node.test, localScope)
        const consequent = await this.resolveNodeExpression(
          node.consequent,
          localScope,
        )
        const alternate = await this.resolveNodeExpression(
          node.alternate,
          localScope,
        )
        return test ? consequent : alternate

      case 'CallExpression':
        return await this.handleFunction(node, false, localScope)

      case 'NewExpression':
        throw this.syntaxError(node, `New expressions are not supported`)

      default:
        throw this.syntaxError(
          node,
          `Unsupported expression type: ${node.type}`,
        )
    }
  }

  private parseNodeChildren = async (
    children: TemplateNode[] | undefined,
    localScope: Scope,
  ): Promise<string> => {
    const parsedChildren: string[] = []
    const childrenScope = localScope.copy()
    for (const child of children || []) {
      const parsedChild = await this.parseNode(child, childrenScope)
      parsedChildren.push(parsedChild)
    }
    return parsedChildren.join('') || ''
  }

  private AVAILABLE_METHODS: Record<string, Function> = {
    param: async (
      interpolation: boolean,
      name: string,
      defaultValue?: unknown,
    ) => {
      if (this.params.hasOwnProperty(name))
        return interpolation
          ? this.resolve(this.params[name], name)
          : this.params[name]
      if (defaultValue === undefined)
        throw new Error(`Missing parameter: ${name}`)
      return interpolation ? this.resolve(defaultValue, name) : defaultValue
    },
    cast: async (interpolation: boolean, value: unknown, type: string) => {
      if (!CAST_METHODS.hasOwnProperty(type))
        throw new Error(`Unsupported cast type: '${type}'`)
      const castMethod = CAST_METHODS[type]!
      const parsedValue = castMethod(value)
      return interpolation ? this.resolve(parsedValue) : parsedValue
    },
    ref: async (interpolation: boolean, queryName: string) => {
      if (!interpolation)
        throw new Error('ref function cannot be used inside a logic block')
      const fullQueryName = queryName.endsWith('.sql')
        ? queryName
        : `${queryName}.sql`
      if (this.compiledQueryNames.includes(fullQueryName)) {
        throw new Error(
          'Query reference to a parent, resulting in cyclic references.',
        )
      }
      const query = this.readQueryFn(fullQueryName)
      if (query === undefined)
        throw new Error(`Referenced query not found: '${fullQueryName}'`)
      const compiler = new Compiler({
        params: this.params,
        resolveFn: this.resolveFn.bind(this),
        readQueryFn: this.readQueryFn.bind(this),
        runQueryFn: this.runQueryFn.bind(this),
        compiledQueryNames: this.compiledQueryNames,
        resolvedParams: this.resolvedParams,
        varStash: [],
      })
      const compiledQuery = await compiler.compile(queryName)
      return `(${compiledQuery.sql})`
    },
    run_query: async (interpolation: boolean, queryName: string) => {
      if (interpolation)
        throw new Error(
          'run_query function cannot be directly interpolated into the query',
        )
      const fullQueryName = queryName.endsWith('.sql')
        ? queryName
        : `${queryName}.sql`
      if (this.compiledQueryNames.includes(fullQueryName)) {
        throw new Error(
          'Query reference to a parent, resulting in cyclic references.',
        )
      }
      const query = this.readQueryFn(fullQueryName)
      if (query === undefined)
        throw new Error(`Referenced query not found: '${fullQueryName}'`)
      const compiler = new Compiler({
        params: this.params,
        resolveFn: this.resolveFn.bind(this),
        readQueryFn: this.readQueryFn.bind(this),
        runQueryFn: this.runQueryFn.bind(this),
        compiledQueryNames: this.compiledQueryNames,
        resolvedParams: [],
        varStash: [],
      })
      const compiledQuery = await compiler.compile(queryName)
      return this.runQueryFn(compiledQuery)
    },
  }

  private handleFunction = async (
    node: SimpleCallExpression,
    interpolation: boolean,
    localScope: Scope,
  ): Promise<string | unknown> => {
    const methodName = (node.callee as Identifier).name
    if (!this.AVAILABLE_METHODS.hasOwnProperty(methodName)) {
      throw this.syntaxError(node.callee, `Unsupported function: ${methodName}`)
    }
    const method = this.AVAILABLE_METHODS[methodName]!
    const args: unknown[] = []
    for (const arg of node.arguments) {
      args.push(await this.resolveNodeExpression(arg, localScope))
    }
    try {
      return await method(interpolation, ...args)
    } catch (error: unknown) {
      if (error instanceof SyntaxError) throw error
      throw this.syntaxError(node, (error as Error).message)
    }
  }
}

interface ICompileError {
  code: string
  message: string
  start?: { line: number; column: number; character: number }
  end?: { line: number; column: number; character: number }
  frame?: string
  pos?: number
}

type QueryCompileErrorContext = {
  query: string
  pos?: {
    start: {
      line: number
      column: number
    }
    end: {
      line: number
      column: number
    }
  }
}

export class SyntaxError extends ConnectorError {
  constructor(
    message: string,
    public context: QueryCompileErrorContext,
  ) {
    super(message)
  }
}
