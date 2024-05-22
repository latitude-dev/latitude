import { type ResolveNodeProps } from '../types'
import { type Literal } from 'estree'

/**
 * ### Literal
 * Represents a literal value.
 */
export async function resolve({ node }: ResolveNodeProps<Literal>) {
  return node.value
}
