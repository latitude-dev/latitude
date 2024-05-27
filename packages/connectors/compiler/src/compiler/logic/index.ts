import { QueryMetadata } from '../types'
import { nodeResolvers, nodeMetadataReader } from './nodes'
import type { ReadNodeMetadataProps, NodeType, ResolveNodeProps } from './types'
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

/**
 * Given a node, extracts the supported methods that are being invoked.
 */
export async function getLogicNodeMetadata(
  props: ReadNodeMetadataProps<Node>,
): Promise<QueryMetadata> {
  const type = props.node.type as NodeType
  if (!nodeMetadataReader[type]) {
    throw new Error(`Unknown node type: ${type}`)
  }

  const methodExtractor = nodeMetadataReader[props.node.type as NodeType]
  return methodExtractor(props)
}
