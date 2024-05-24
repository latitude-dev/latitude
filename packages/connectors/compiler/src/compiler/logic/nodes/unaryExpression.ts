import { getLogicNodeMetadata, resolveLogicNode } from '..'
import errors from '../../../error/errors'
import { UNARY_OPERATOR_METHODS } from '../operators'
import type { ReadNodeMetadataProps, ResolveNodeProps } from '../types'
import type { UnaryExpression } from 'estree'

/**
 * ### UnaryExpression
 * Represents a simple operation on a single operand, either as a prefix or suffix.
 *
 * Example: `{!a}`
 */
export async function resolve({
  node,
  raiseError,
  ...props
}: ResolveNodeProps<UnaryExpression>) {
  const unaryOperator = node.operator
  if (!(unaryOperator in UNARY_OPERATOR_METHODS)) {
    raiseError(errors.unsupportedOperator(unaryOperator), node)
  }

  const unaryArgument = await resolveLogicNode({
    node: node.argument,
    raiseError,
    ...props,
  })
  const unaryPrefix = node.prefix
  return UNARY_OPERATOR_METHODS[unaryOperator]?.(unaryArgument, unaryPrefix)
}

export async function readMetadata({
  node,
  ...props
}: ReadNodeMetadataProps<UnaryExpression>) {
  return await getLogicNodeMetadata({
    node: node.argument,
    ...props,
  })
}
