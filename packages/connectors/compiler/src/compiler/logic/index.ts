import { nodeResolvers } from './nodes'
import type { NodeType, ResolveNodeProps } from './types'
import type { Node } from 'estree'

/**
 * Given a node, calculates the resulting value.
 */
export async function resolveLogicNode(props: ResolveNodeProps<Node>) {
  const type = props.node.type as NodeType
  if (!nodeResolvers[type]) {
    throw new Error(`Unknown node type: ${type}`)
  }

  const nodeResolver = nodeResolvers[props.node.type as NodeType]
  return nodeResolver(props)
}
