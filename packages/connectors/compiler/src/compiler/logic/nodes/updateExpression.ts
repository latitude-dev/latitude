import { getLogicNodeMetadata, resolveLogicNode } from '..'
import errors from '../../../error/errors'
import type { ReadNodeMetadataProps, ResolveNodeProps } from '../types'
import type { AssignmentExpression, UpdateExpression } from 'estree'

/**
 * ### UpdateExpression
 * Represents a javascript update expression.
 * Depending on the operator, it can increment or decrement a value.
 * Depending on the position of the operator, the return value can be resolved before or after the operation.
 *
 * Examples: `{--foo}` `{bar++}`
 */
export async function resolve({
  node,
  scope,
  raiseError,
  ...props
}: ResolveNodeProps<UpdateExpression>) {
  const updateOperator = node.operator

  if (!['++', '--'].includes(updateOperator)) {
    raiseError(errors.unsupportedOperator(updateOperator), node)
  }

  const assignmentOperators = {
    '++': '+=',
    '--': '-=',
  }

  const originalValue = await resolveLogicNode({
    node: node.argument,
    scope,
    raiseError,
    ...props,
  })

  if (typeof originalValue !== 'number') {
    raiseError(errors.invalidUpdate(updateOperator, typeof originalValue), node)
  }

  // Simulate an AssignmentExpression with the same operation
  const assignmentNode = {
    ...node,
    type: 'AssignmentExpression',
    left: node.argument,
    operator: assignmentOperators[updateOperator],
    right: {
      type: 'Literal',
      value: 1,
    },
  } as AssignmentExpression

  // Perform the assignment
  const updatedValue = await resolveLogicNode({
    node: assignmentNode,
    scope,
    raiseError,
    ...props,
  })

  return node.prefix ? updatedValue : originalValue
}

export async function readMetadata({
  node,
  ...props
}: ReadNodeMetadataProps<UpdateExpression>) {
  return await getLogicNodeMetadata({
    node: node.argument,
    ...props,
  })
}
