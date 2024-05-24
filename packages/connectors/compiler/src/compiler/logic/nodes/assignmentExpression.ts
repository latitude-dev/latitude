import { getLogicNodeMetadata, resolveLogicNode } from '..'
import errors from '../../../error/errors'
import { mergeMetadata } from '../../utils'
import { ASSIGNMENT_OPERATOR_METHODS } from '../operators'
import type { ReadNodeMetadataProps, ResolveNodeProps } from '../types'
import type {
  AssignmentExpression,
  AssignmentOperator,
  Identifier,
  MemberExpression,
} from 'estree'

/**
 * ### AssignmentExpression
 * Represents an assignment or update to a variable or property. Returns the newly assigned value.
 * The assignment can be made to an existing variable or property, or to a new one. Assignments to constants are not allowed.
 *
 * Examples: `foo = 1` `obj.foo = 'bar'` `foo += 1`
 */
export async function resolve({
  node,
  scope,
  raiseError,
  ...props
}: ResolveNodeProps<AssignmentExpression>) {
  const assignmentOperator = node.operator
  if (!(assignmentOperator in ASSIGNMENT_OPERATOR_METHODS)) {
    raiseError(errors.unsupportedOperator(assignmentOperator), node)
  }
  const assignmentMethod = ASSIGNMENT_OPERATOR_METHODS[assignmentOperator]!

  const assignmentValue = await resolveLogicNode({
    node: node.right,
    scope,
    raiseError,
    ...props,
  })

  if (node.left.type === 'Identifier') {
    return await assignToVariable({
      assignmentOperator,
      assignmentMethod,
      assignmentValue,
      node: node.left,
      scope,
      raiseError,
      ...props,
    })
  }

  if (node.left.type === 'MemberExpression') {
    return await assignToProperty({
      assignmentOperator,
      assignmentMethod,
      assignmentValue,
      node: node.left,
      scope,
      raiseError,
      ...props,
    })
  }

  raiseError(errors.invalidAssignment, node)
}

async function assignToVariable({
  assignmentOperator,
  assignmentMethod,
  assignmentValue,
  node,
  scope,
  raiseError,
}: ResolveNodeProps<Identifier> & {
  assignmentOperator: AssignmentOperator
  assignmentMethod: (typeof ASSIGNMENT_OPERATOR_METHODS)[keyof typeof ASSIGNMENT_OPERATOR_METHODS]
  assignmentValue: unknown
}) {
  const assignedVariableName = node.name
  if (scope.isConst(assignedVariableName)) {
    raiseError(errors.constantReassignment, node)
  }

  if (assignmentOperator != '=' && !scope.exists(assignedVariableName)) {
    raiseError(errors.variableNotDeclared(assignedVariableName), node)
  }

  const updatedValue = assignmentMethod(
    scope.exists(assignedVariableName)
      ? scope.get(assignedVariableName)
      : undefined,
    assignmentValue,
  )

  scope.set(assignedVariableName, updatedValue)
  return updatedValue
}

async function assignToProperty({
  assignmentOperator,
  assignmentMethod,
  assignmentValue,
  node,
  ...props
}: ResolveNodeProps<MemberExpression> & {
  assignmentOperator: AssignmentOperator
  assignmentMethod: (typeof ASSIGNMENT_OPERATOR_METHODS)[keyof typeof ASSIGNMENT_OPERATOR_METHODS]
  assignmentValue: unknown
}) {
  const { raiseError } = props
  const object = (await resolveLogicNode({
    node: node.object,
    ...props,
  })) as { [key: string]: any }

  const property = (
    node.computed
      ? await resolveLogicNode({
          node: node.property,
          ...props,
        })
      : (node.property as Identifier).name
  ) as string

  if (assignmentOperator != '=' && !(property in object)) {
    raiseError(errors.propertyNotExists(property), node)
  }

  const originalValue = object[property]
  const updatedValue = assignmentMethod(originalValue, assignmentValue)
  object[property] = updatedValue
  return updatedValue
}

export async function readMetadata({
  node,
  ...props
}: ReadNodeMetadataProps<AssignmentExpression>) {
  return mergeMetadata(
    await getLogicNodeMetadata({ node: node.right, ...props }),
    await getLogicNodeMetadata({ node: node.left, ...props }),
  )
}
