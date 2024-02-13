import { TemplateNode } from 'svelte/types/compiler/interfaces'
import { Node, Identifier, BaseNodeWithoutComments } from 'estree'
import { parse } from 'svelte/compiler'
import path from 'path'
import fs from 'fs'

export enum DataType {
  Boolean = 'boolean',
  Integer = 'integer',
  Float = 'float',
  String = 'string',
  Datetime = 'datetime',
  Null = 'null',
  Unknown = 'unknown',
}

export type Field = {
  name: string
  type: DataType
}

export type QueryParams = {
  [key: string]: unknown
}

export type QueryRequest = {
  queryPath: string
  params?: QueryParams
}

export type QueryResult = {
  rowCount: number | null
  fields: Field[]
  rows: unknown[][]
}

export type SequentialCompiledParams = unknown[]
export type KeyBasedCompiledParams = { [key: string]: unknown }

export type CompiledQuery = {
  sql: string
  params: SequentialCompiledParams | KeyBasedCompiledParams
}

export abstract class BaseConnector {
  private rootPath: string

  constructor(rootPath: string) {
    this.rootPath = rootPath
  }

  /**
   * Results from operations calculated while compiling the query will be added as
   * additional parameters, instead of interpolations. These new parameters are called
   * phantom parameters, and they're added with a reserved prefix followed by an
   * incrementing number based on the usage. This prefix can be changed if it is not
   * valid for a connector parameterisation function. As this prefix is reserved for
   * phantom parameters, the compilation will raise an error if it is present in a
   * defined parameter.
   */
  protected PHANTOM_PARAM_PREFIX = '_'

  /**
   * While compiling the query, the connector will call this method to resolve the
   * parameterised string for a variable. This method should return a string with the
   * parameterised value, and store the variable and its value for later use.
   */
  protected abstract resolve(varName: string, value: unknown): string

  /**
   * After compiling the query, the connector will call this method to retrieve the
   * parameters to be used in the query execution. This method should return the
   * parameters that were stored while resolving the parameterised strings, and clear
   * the stored parameters for a future query.
   */
  protected abstract popParams():
    | SequentialCompiledParams
    | KeyBasedCompiledParams

  protected abstract runQuery(request: CompiledQuery): Promise<QueryResult>

  async query(request: QueryRequest): Promise<QueryResult> {
    const compiledSql = this.compile(
      this.fullQueryPath(request.queryPath),
      request.params,
    )
    const compiledParams = this.popParams()
    return this.runQuery({ sql: compiledSql, params: compiledParams })
  }

  private fullQueryPath(queryPath: string): string {
    const queryPathWithExtension = queryPath.endsWith('.sql')
      ? queryPath
      : `${queryPath}.sql`
    return path.join(this.rootPath, queryPathWithExtension)
  }

  protected compile(
    fullQueryPath: string,
    params?: QueryParams,
    compiledQueryPaths: string[] = [],
  ): string {
    compiledQueryPaths.push(fullQueryPath)
    const sql = fs.readFileSync(fullQueryPath, 'utf8')

    if (
      params &&
      Object.keys(params).some((key) =>
        key.startsWith(this.PHANTOM_PARAM_PREFIX),
      )
    ) {
      throw new SyntaxError(
        `Parameter keys cannot start with ${this.PHANTOM_PARAM_PREFIX}`,
        { query: sql },
      )
    }
    const phantomParams: QueryParams = {}

    const getVarValue = (varName: string, defaultValue?: unknown) => {
      return params?.[varName] ?? defaultValue
    }

    const parameteriseValue = (varName: string, defaultValue?: unknown) => {
      return this.resolve(varName, getVarValue(varName, defaultValue))
    }

    const parseValue = (value: unknown): string => {
      // Create a new unique phantom param for this value and parameterise it, instead of directly interpolating the value
      const phantomParamKey = `${this.PHANTOM_PARAM_PREFIX}${
        Object.keys(phantomParams).length
      }`
      phantomParams[phantomParamKey] = value

      return this.resolve(phantomParamKey, value)
    }

    const OPERATOR_METHODS: {
      [key: string]: (left: unknown, right: unknown) => unknown
    } = {
      '>': (left: unknown, right: unknown): unknown =>
        (left as number) > (right as number),
      '>=': (left: unknown, right: unknown): unknown =>
        (left as number) >= (right as number),
      '<': (left: unknown, right: unknown): unknown =>
        (left as number) < (right as number),
      '<=': (left: unknown, right: unknown): unknown =>
        (left as number) <= (right as number),
      '==': (left: unknown, right: unknown): unknown =>
        (left as number) === (right as number),
      '!=': (left: unknown, right: unknown): unknown =>
        (left as number) !== (right as number),
      '&&': (left: unknown, right: unknown): unknown =>
        (left as boolean) && (right as boolean),
      '||': (left: unknown, right: unknown): unknown =>
        (left as boolean) || (right as boolean),
      '+': (left: unknown, right: unknown): unknown =>
        (left as number) + (right as number),
      '-': (left: unknown, right: unknown): unknown =>
        (left as number) - (right as number),
      '*': (left: unknown, right: unknown): unknown =>
        (left as number) * (right as number),
      '/': (left: unknown, right: unknown): unknown =>
        (left as number) / (right as number),
      '%': (left: unknown, right: unknown): unknown =>
        (left as number) % (right as number),
      '??': (left: unknown, right: unknown): unknown =>
        (left as unknown) ?? (right as unknown),
    }

    function resolveNodeExpression(node: Node, localScope: Scope): unknown {
      switch (node.type) {
        case 'Literal':
          return node.value

        case 'Identifier':
          if (!localScope.hasOwnProperty(node.name))
            throw newSyntaxError(sql, node, `Undefined variable: ${node.name}`)
          return localScope[node.name]

        case 'ObjectExpression':
          return node.properties.reduce((acc, prop) => {
            if (prop.type !== 'Property')
              throw newSyntaxError(
                sql,
                node,
                'Object definition can only contain properties',
              )

            const key = prop.key as Identifier
            const value = resolveNodeExpression(prop.value, localScope)

            acc[key.name] = value
            return acc
          }, {} as Scope)

        case 'BinaryExpression':
        case 'LogicalExpression':
          const operator = node.operator

          if (!OPERATOR_METHODS.hasOwnProperty(operator))
            throw newSyntaxError(sql, node, `Unsupported operator: ${operator}`)

          const left = resolveNodeExpression(node.left, localScope)
          const right = resolveNodeExpression(node.right, localScope)

          return OPERATOR_METHODS[operator]?.(left, right)

        case 'CallExpression':
          const methodName = (node.callee as Identifier).name

          if (methodName === 'param') {
            const args = node.arguments.map((arg) =>
              resolveNodeExpression(arg, localScope),
            )
            if (
              !params?.hasOwnProperty(args[0] as string) &&
              args[1] === undefined
            ) {
              throw newSyntaxError(sql, node, `Missing parameter: ${args[0]}`)
            }
            return getVarValue(args[0] as string, args[1])
          }
          if (methodName === 'ref') {
            throw newSyntaxError(
              sql,
              node,
              `Unable to reference a query inside a logic block`,
            )
          }
          throw newSyntaxError(sql, node, `Unsupported function: ${methodName}`)

        default:
          throw newSyntaxError(
            sql,
            node,
            `Unsupported expression type: ${node.type}`,
          )
      }
    }

    const parseNode = (node: TemplateNode, localScope: Scope = {}): string => {
      if (!node) return ''

      switch (node.type) {
        case 'Fragment':
          return parseChildrenNodes(node.children, localScope)

        case 'Comment':
          return ''

        case 'Text':
          return node.raw

        case 'MustacheTag':
          return parseNode(node.expression, localScope)

        case 'IfBlock':
          return resolveNodeExpression(node.expression, localScope)
            ? parseChildrenNodes(node.children, localScope)
            : parseNode(node.else, localScope)

        case 'ElseBlock':
          return parseChildrenNodes(node.children, localScope)

        case 'EachBlock':
          const iterableElement = resolveNodeExpression(
            node.expression,
            localScope,
          )
          if (!Array.isArray(iterableElement))
            throw newSyntaxError(
              sql,
              node.expression,
              'Element in #each block must be an array',
            )
          if (!iterableElement.length) return parseNode(node.else, localScope)

          const contextVar = node.context.name
          const indexVar = node.index

          return iterableElement
            .map((item, index) => {
              const childScope = {
                ...localScope,
                [contextVar]: item,
                [indexVar]: index,
              }
              return parseChildrenNodes(node.children, childScope)
            })
            .join('')

        case 'Literal':
        case 'Identifier':
        case 'BinaryExpression':
        case 'LogicalExpression':
          return parseValue(resolveNodeExpression(node as Node, localScope))

        case 'ObjectExpression':
          throw newSyntaxError(
            sql,
            node,
            'Object definitions are not allowed for interpolation',
          )

        case 'CallExpression':
          const methodName = (node.callee as Identifier).name

          if (methodName === 'param') {
            const args = node.arguments.map(resolveNodeExpression)
            if (!params?.hasOwnProperty(args[0]) && args[1] === undefined) {
              throw newSyntaxError(sql, node, `Missing parameter: ${args[0]}`)
            }
            return parameteriseValue(args[0] as string, args[1])
          }
          if (methodName === 'ref') {
            const args = node.arguments.map(resolveNodeExpression)
            if (args.length !== 1)
              throw newSyntaxError(
                sql,
                node,
                `ref function must have exactly one argument`,
              )
            const fullRefQueryPath = this.fullQueryPath(args[0] as string)
            if (compiledQueryPaths.includes(fullRefQueryPath)) {
              throw newSyntaxError(
                sql,
                node,
                'Query reference to a parent, resulting in cyclic references.',
              )
            }
            if (!fs.existsSync(fullRefQueryPath)) {
              throw newSyntaxError(
                sql,
                node,
                `Referenced query not found: '${args[0]}'`,
              )
            }
            return (
              '(' +
              this.compile(fullRefQueryPath, params, compiledQueryPaths) +
              ')'
            )
          }
          throw newSyntaxError(
            sql,
            node.callee,
            `Unsupported function: ${methodName}`,
          )

        default:
          throw newSyntaxError(sql, node, `Unsupported node type: ${node.type}`)
      }
    }

    function parseChildrenNodes(
      children: TemplateNode[] | undefined,
      localScope: Scope = {},
    ): string {
      return (
        children
          ?.map((child) => {
            if (child.type === 'ConstTag') {
              // Only allow constant tags to define variables
              if (child.expression.type !== 'AssignmentExpression')
                throw newSyntaxError(
                  sql,
                  child.expression,
                  'Constant definitions must assign a value',
                )
              if (child.expression.operator !== '=')
                throw newSyntaxError(
                  sql,
                  child.expression,
                  'Constant definitions must use the = operator',
                )
              if (child.expression.left.type !== 'Identifier')
                throw newSyntaxError(
                  sql,
                  child.expression,
                  'Constant definitions must have an identifier on the left side',
                )

              const varName = child.expression.left.name
              const varValue = resolveNodeExpression(
                child.expression.right,
                localScope,
              )

              localScope[varName] = varValue
              return ''
            }

            return parseNode(child, localScope)
          })
          .join('') ?? ''
      )
    }

    const result = parse(sql)
    const compiledSql = parseNode(result.html)
      .replace(/\n/g, ' ') // Compile into a single line
      .replace(/\s+/g, ' ') // Remove extra spaces
      .trim() // Remove leading and trailing spaces

    return compiledSql
  }
}

type Scope = { [key: string]: unknown }
const newSyntaxError = (
  sql: string,
  node: BaseNodeWithoutComments,
  message: string,
) => {
  return new SyntaxError(message, {
    query: sql,
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

export class ConnectorError extends Error {}
export class ConnectionError extends ConnectorError {}
export class QueryError extends ConnectorError {}
export class SyntaxError extends Error {
  constructor(
    message: string,
    public context: QueryCompileErrorContext,
  ) {
    super(message)
  }
}
