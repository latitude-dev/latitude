import { resolveLogicNode } from '..'
import type { ResolveNodeProps } from '../types'
import type { ArrayExpression } from 'estree'

/**
 * ### ArrayExpression
 * Returns an array of values
 */

export async function resolve({
  node,
  ...props
}: ResolveNodeProps<ArrayExpression>) {
  return await Promise.all(
    node.elements.map((element) =>
      element
        ? resolveLogicNode({
            node: element,
            ...props,
          })
        : null,
    ),
  )
}
