import { getLogicNodeMetadata, resolveLogicNode } from '..'
import errors from '../../../error/errors'
import { mergeMetadata } from '../../utils'
import { ReadNodeMetadataProps, type ResolveNodeProps } from '../types'
import {
  Property,
  SpreadElement,
  type Identifier,
  type ObjectExpression,
} from 'estree'

/**
 * ### ObjectExpression
 * Represents a javascript Object
 */
export async function resolve({
  node,
  scope,
  raiseError,
  ...props
}: ResolveNodeProps<ObjectExpression>) {
  const resolvedObject: { [key: string]: any } = {}
  for (const prop of node.properties) {
    if (prop.type !== 'Property') {
      throw raiseError(errors.invalidObjectKey, node)
    }
    const key = prop.key as Identifier
    const value = await resolveLogicNode({
      node: prop.value,
      scope,
      raiseError,
      ...props,
    })
    resolvedObject[key.name] = value
  }
  return resolvedObject
}

function isProperty(prop: Property | SpreadElement): prop is Property {
  return prop.type === 'Property'
}

export async function readMetadata({
  node,
  ...props
}: ReadNodeMetadataProps<ObjectExpression>) {
  const propertiesMetadata = await Promise.all(
    node.properties.filter(isProperty).map((prop) =>
      Promise.all([
        getLogicNodeMetadata({
          node: prop.key,
          ...props,
        }),
        getLogicNodeMetadata({
          node: prop.value,
          ...props,
        }),
      ]),
    ),
  )

  return mergeMetadata(...propertiesMetadata.flat())
}
