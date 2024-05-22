import { resolveLogicNode } from '..'
import type { ResolveNodeProps } from '../types'
import type { SequenceExpression } from 'estree'

/**
 * ### SequenceExpression
 * Represents a sequence of expressions. It is only used to evaluate ?. operators.
 */
export async function resolve({
  node,
  ...props
}: ResolveNodeProps<SequenceExpression>) {
  return await Promise.all(
    node.expressions.map((expression) =>
      resolveLogicNode({ node: expression, ...props }),
    ),
  )
}
