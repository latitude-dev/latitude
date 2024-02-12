import { TemplateNode } from "svelte/types/compiler/interfaces";
import { Node, Identifier, BaseNodeWithoutComments } from "estree";
import { BaseAdapter, QueryParams, ConnectorError } from ".";
import { parse } from 'svelte/compiler'

export const PHANTOM_PARAM_PREFIX = '_'

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

export class SyntaxError extends Error {
  constructor(message: string, public context: QueryCompileErrorContext) {
    super(message)
  }
}

type Scope = {
  [key: string]: unknown
}

export function compile(adapter: BaseAdapter, sql: string, params?: QueryParams): string {

  const newSyntaxError = (message: string, node: BaseNodeWithoutComments) => {
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
        }
      }
    })
  }

  if (params && Object.keys(params).some(key => key.startsWith(PHANTOM_PARAM_PREFIX))) {
    throw new SyntaxError(`Parameter keys cannot start with ${PHANTOM_PARAM_PREFIX}`, { query: sql })
  }
  const phantomParams: QueryParams = {}

  const getVarValue = (varName: string, defaultValue?: unknown) => {
    return params?.[varName] ?? defaultValue  
  }

  const parameteriseValue = (varName: string, defaultValue?: unknown) => {
    return adapter.resolve(varName, getVarValue(varName, defaultValue))
  }

  function parseValue(value: unknown): string {
    // Create a new unique phantom param for this value and parameterise it, instead of directly interpolating the value
    const phantomParamKey = `${PHANTOM_PARAM_PREFIX}${Object.keys(phantomParams).length}`
    phantomParams[phantomParamKey] = value

    return adapter.resolve(phantomParamKey, value)
  }

  const OPERATOR_METHODS: { [key: string]: (left: unknown, right: unknown) => unknown } = {
    '>':  (left: unknown, right: unknown): unknown => (left as number) > (right as number),
    '>=': (left: unknown, right: unknown): unknown => (left as number) >= (right as number),
    '<':  (left: unknown, right: unknown): unknown => (left as number) < (right as number),
    '<=': (left: unknown, right: unknown): unknown => (left as number) <= (right as number),
    '==': (left: unknown, right: unknown): unknown => (left as number) === (right as number),
    '!=': (left: unknown, right: unknown): unknown => (left as number) !== (right as number),
    '&&': (left: unknown, right: unknown): unknown => (left as boolean) && (right as boolean),
    '||': (left: unknown, right: unknown): unknown => (left as boolean) || (right as boolean),
    '+':  (left: unknown, right: unknown): unknown => (left as number) + (right as number),
    '-':  (left: unknown, right: unknown): unknown => (left as number) - (right as number),
    '*':  (left: unknown, right: unknown): unknown => (left as number) * (right as number),
    '/':  (left: unknown, right: unknown): unknown => (left as number) / (right as number),
    '%':  (left: unknown, right: unknown): unknown => (left as number) % (right as number),
    '??': (left: unknown, right: unknown): unknown => (left as unknown) ?? (right as unknown),
  }

  function resolveNodeExpression(node: Node, localScope: Scope): unknown {
    switch (node.type) {
      case 'Literal':
        return node.value;

      case 'Identifier':
        if (!localScope.hasOwnProperty(node.name)) throw newSyntaxError(`Undefined variable: ${node.name}`, node);
        return localScope[node.name];

      case 'ObjectExpression':
        return node.properties.reduce((acc, prop) => {
          if (prop.type !== 'Property') throw newSyntaxError('Object definition can only contain properties', prop);

          const key = prop.key as Identifier;
          const value = resolveNodeExpression(prop.value, localScope);

          acc[key.name] = value;
          return acc;
        }, {} as Scope);

      case 'BinaryExpression':
      case 'LogicalExpression':
        const operator = node.operator;

        if (!OPERATOR_METHODS.hasOwnProperty(operator)) throw newSyntaxError(`Unsupported operator: ${operator}`, node);

        const left = resolveNodeExpression(node.left, localScope);
        const right = resolveNodeExpression(node.right, localScope);

        return OPERATOR_METHODS[operator]?.(left, right);

      case 'CallExpression':
        const methodName = (node.callee as Identifier).name;
        
        if (methodName === 'param') {
          const args = node.arguments.map(arg => resolveNodeExpression(arg, localScope));
          if (!params?.hasOwnProperty(args[0] as string) && args[1] === undefined) {
            throw newSyntaxError(`Missing parameter: ${args[0]}`, node);
          }
          return getVarValue(args[0] as string, args[1]);
        }
        throw newSyntaxError(`Unsupported function: ${methodName}`, node);

      default:
        throw newSyntaxError(`Unsupported expression type: ${node.type}`, node);
    }
  }

  function parseNode(node: TemplateNode, localScope: Scope = {}): string {
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
        const iterableElement = resolveNodeExpression(node.expression, localScope)
        if (!Array.isArray(iterableElement)) throw newSyntaxError('Element in #each block must be an array', node.expression)
        if (!iterableElement.length) return parseNode(node.else, localScope)

        const contextVar = node.context.name
        const indexVar = node.index

        return iterableElement.map((item, index) => {
          const childScope = {
            ...localScope,
            [contextVar]: item,
            [indexVar]: index,
          }
          return parseChildrenNodes(node.children, childScope)
        }).join('')
            
      case 'Literal':
      case 'Identifier':
      case 'BinaryExpression':
      case 'LogicalExpression':
        return parseValue(resolveNodeExpression(node as Node, localScope))

      case 'ObjectExpression':
        throw newSyntaxError('Object definitions are not allowed for interpolation', node)

      case 'CallExpression':
        const methodName = (node.callee as Identifier).name;
        
        if (methodName === 'param') {
          const args = node.arguments.map(resolveNodeExpression);
          if (!params?.hasOwnProperty(args[0]) && args[1] === undefined) {
            throw newSyntaxError(`Missing parameter: ${args[0]}`, node);
          }
          return parameteriseValue(args[0] as string, args[1]);
        }
        throw newSyntaxError(`Unsupported function: ${methodName}`, node.callee);
      
      default:
        throw newSyntaxError(`Unsupported node type: ${node.type}`, node)
    }
  }

  function parseChildrenNodes(children: TemplateNode[] | undefined, localScope: Scope = {}): string {
    return children?.map((child) => {
      if (child.type === 'ConstTag') {

        // Only allow constant tags to define variables
        if (child.expression.type !== 'AssignmentExpression') throw newSyntaxError('Constant definitions must assign a value', child.expression)
        if (child.expression.operator !== '=') throw newSyntaxError('Constant definitions must use the = operator', child.expression)
        if (child.expression.left.type !== 'Identifier') throw newSyntaxError('Constant definitions must have an identifier on the left side', child.expression)

        const varName = child.expression.left.name
        const varValue = resolveNodeExpression(child.expression.right, localScope)

        localScope[varName] = varValue
        return ''
      }

      return parseNode(child, localScope)
    }).join('') ?? ''
  }

  const result = parse(sql)
  const compiledSql = parseNode(result.html)
    .replace(/\n/g, ' ') // Compile into a single line
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim() // Remove leading and trailing spaces

  return compiledSql
}