import { getLogicNodeMetadata, resolveLogicNode } from '..'
import { emptyMetadata, mergeMetadata } from '../../utils'
import type { ReadNodeMetadataProps, ResolveNodeProps } from '../types'
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

export async function readMetadata({
  node,
  ...props
}: ReadNodeMetadataProps<ArrayExpression>) {
  const childrenMetadata = await Promise.all(
    node.elements.map(async (element) => {
      if (element)
        return await getLogicNodeMetadata({ node: element, ...props })
      return emptyMetadata()
    }),
  )
  return mergeMetadata(...childrenMetadata)
}
