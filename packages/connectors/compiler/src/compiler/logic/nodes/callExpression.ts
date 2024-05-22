import { getLogicNodeMetadata, resolveLogicNode } from '..'
import CompileError from '../../../error/error'
import errors from '../../../error/errors'
import { mergeMetadata } from '../../utils'
import type { ReadNodeMetadataProps, ResolveNodeProps } from '../types'
import { NodeType } from '../types'
import type { Identifier, SimpleCallExpression } from 'estree'

/**
 * ### CallExpression
 * Represents a method call.
 *
 * Examples: `foo()` `foo.bar()`
 */
export async function resolve({
  node,
  raiseError,
  willInterpolate,
  ...props
}: ResolveNodeProps<SimpleCallExpression>) {
  const method = await getMethod({
    node,
    raiseError,
    willInterpolate,
    ...props,
  })
  if (typeof method !== 'function')
    raiseError(errors.notAFunction(typeof method), node)

  const args: unknown[] = []
  for (const arg of node.arguments) {
    args.push(
      await resolveLogicNode({
        node: arg,
        raiseError,
        willInterpolate,
        ...props,
      }),
    )
  }

  // Add the 'willInterpolate' flag as the first argument to supported methods
  if (isSupportedMethod(node, props.supportedMethods)) {
    args.unshift(willInterpolate)
  }

  try {
    return await runMethod({
      method,
      args,
      node,
      raiseError,
      willInterpolate,
      ...props,
    })
  } catch (error: unknown) {
    if (error instanceof CompileError) throw error
    raiseError(errors.functionCallError(error), node)
  }
}

interface SupportedMethodCallExpression extends SimpleCallExpression {
  callee: Identifier
}

type SupportedMethod =
  ResolveNodeProps<SimpleCallExpression>['supportedMethods']

function isSupportedMethod(
  node: SimpleCallExpression,
  supportedMethods: SupportedMethod,
): node is SupportedMethodCallExpression {
  return (
    node.callee.type === NodeType.Identifier &&
    node.callee.name in supportedMethods
  )
}

async function getMethod({
  node,
  scope,
  supportedMethods,
  ...props
}: ResolveNodeProps<SimpleCallExpression>): Promise<Function> {
  if (isSupportedMethod(node, supportedMethods)) {
    return supportedMethods[node.callee.name] as Function
  }
  return (await resolveLogicNode({
    node: node.callee,
    scope,
    supportedMethods,
    ...props,
  })) as Function
}

async function runMethod({
  method,
  args,
  node,
  willInterpolate,
  raiseError,
}: ResolveNodeProps<SimpleCallExpression> & {
  method: Function
  args: unknown[]
}) {
  const result = await method(...args)
  if (willInterpolate && typeof result !== 'string') {
    raiseError(errors.invalidFunctionResultInterpolation, node)
  }
  if (willInterpolate && !result) return ''
  return result
}

export async function readMetadata({
  node,
  supportedMethods,
  ...props
}: ReadNodeMetadataProps<SimpleCallExpression>) {
  const argumentsMetadata = await Promise.all(
    node.arguments.map((arg) =>
      getLogicNodeMetadata({
        node: arg,
        supportedMethods,
        ...props,
      }),
    ),
  )

  const calleeMetadata = await getLogicNodeMetadata({
    node: node.callee,
    supportedMethods,
    ...props,
  })

  if (node.callee.type === NodeType.Identifier) {
    const methodName = node.callee.name
    if (methodName in supportedMethods) {
      calleeMetadata.methods.add(methodName)
    }
  }

  return mergeMetadata(calleeMetadata, ...argumentsMetadata)
}
