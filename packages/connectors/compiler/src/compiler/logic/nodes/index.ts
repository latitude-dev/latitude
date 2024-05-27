import {
  resolve as resolveArrayExpression,
  readMetadata as readArrayMetadata,
} from './arrayExpression'
import {
  resolve as resolveAssignmentExpression,
  readMetadata as readAssignmentMetadata,
} from './assignmentExpression'
import {
  resolve as resolveChainExpression,
  readMetadata as readChainMetadata,
} from './chainExpression'
import {
  resolve as resolveCallExpression,
  readMetadata as readCallMetadata,
} from './callExpression'
import {
  resolve as resolveBinaryExpression,
  readMetadata as readBinaryMetadata,
} from './binaryExpression'
import {
  resolve as resolveConditionalExpression,
  readMetadata as readConditionalMetadata,
} from './conditionalExpression'
import { resolve as resolveIdentifier } from './identifier'
import { resolve as resolveLiteral } from './literal'
import {
  resolve as resolveObjectExpression,
  readMetadata as readObjectMetadata,
} from './objectExpression'
import {
  resolve as resolveMemberExpression,
  readMetadata as readMemberMetadata,
} from './memberExpression'
import {
  resolve as resolveSequenceExpression,
  readMetadata as readSequenceMetadata,
} from './sequenceExpression'
import {
  resolve as resolveUnaryExpression,
  readMetadata as readUnaryMetadata,
} from './unaryExpression'
import {
  resolve as resolveUpdateExpression,
  readMetadata as readUpdateMetadata,
} from './updateExpression'
import { ReadNodeMetadataProps, NodeType, ResolveNodeProps } from '../types'
import { Node } from 'estree'
import { QueryMetadata } from '../../types'
import { emptyMetadata } from '../../utils'

type ResolveNodeFn = (props: ResolveNodeProps<Node>) => Promise<unknown>
type ReadNodeMetadataFn = (
  props: ReadNodeMetadataProps<Node>,
) => Promise<QueryMetadata>

export const nodeResolvers: Record<NodeType, ResolveNodeFn> = {
  [NodeType.ArrayExpression]: resolveArrayExpression as ResolveNodeFn,
  [NodeType.AssignmentExpression]: resolveAssignmentExpression as ResolveNodeFn,
  [NodeType.BinaryExpression]: resolveBinaryExpression as ResolveNodeFn,
  [NodeType.CallExpression]: resolveCallExpression as ResolveNodeFn,
  [NodeType.ChainExpression]: resolveChainExpression as ResolveNodeFn,
  [NodeType.ConditionalExpression]:
    resolveConditionalExpression as ResolveNodeFn,
  [NodeType.Identifier]: resolveIdentifier as ResolveNodeFn,
  [NodeType.Literal]: resolveLiteral as ResolveNodeFn,
  [NodeType.LogicalExpression]: resolveBinaryExpression as ResolveNodeFn,
  [NodeType.ObjectExpression]: resolveObjectExpression as ResolveNodeFn,
  [NodeType.MemberExpression]: resolveMemberExpression as ResolveNodeFn,
  [NodeType.SequenceExpression]: resolveSequenceExpression as ResolveNodeFn,
  [NodeType.UnaryExpression]: resolveUnaryExpression as ResolveNodeFn,
  [NodeType.UpdateExpression]: resolveUpdateExpression as ResolveNodeFn,
}

export const nodeMetadataReader: Record<NodeType, ReadNodeMetadataFn> = {
  [NodeType.Identifier]: async () => emptyMetadata(), // No metadata to read
  [NodeType.Literal]: async () => emptyMetadata(), // No metadata to read

  [NodeType.ArrayExpression]: readArrayMetadata as ReadNodeMetadataFn,
  [NodeType.AssignmentExpression]: readAssignmentMetadata as ReadNodeMetadataFn,
  [NodeType.BinaryExpression]: readBinaryMetadata as ReadNodeMetadataFn,
  [NodeType.CallExpression]: readCallMetadata as ReadNodeMetadataFn,
  [NodeType.ChainExpression]: readChainMetadata as ReadNodeMetadataFn,
  [NodeType.ConditionalExpression]:
    readConditionalMetadata as ReadNodeMetadataFn,
  [NodeType.LogicalExpression]: readBinaryMetadata as ReadNodeMetadataFn,
  [NodeType.ObjectExpression]: readObjectMetadata as ReadNodeMetadataFn,
  [NodeType.MemberExpression]: readMemberMetadata as ReadNodeMetadataFn,
  [NodeType.SequenceExpression]: readSequenceMetadata as ReadNodeMetadataFn,
  [NodeType.UnaryExpression]: readUnaryMetadata as ReadNodeMetadataFn,
  [NodeType.UpdateExpression]: readUpdateMetadata as ReadNodeMetadataFn,
}
