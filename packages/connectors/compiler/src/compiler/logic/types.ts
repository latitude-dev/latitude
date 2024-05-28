import { Node } from 'estree'
import Scope from '../scope'
import type { ResolveFn, SupportedMethod } from '../types'

export enum NodeType {
  Literal = 'Literal',
  Identifier = 'Identifier',
  ObjectExpression = 'ObjectExpression',
  ArrayExpression = 'ArrayExpression',
  SequenceExpression = 'SequenceExpression',
  LogicalExpression = 'LogicalExpression',
  BinaryExpression = 'BinaryExpression',
  UnaryExpression = 'UnaryExpression',
  AssignmentExpression = 'AssignmentExpression',
  UpdateExpression = 'UpdateExpression',
  MemberExpression = 'MemberExpression',
  ConditionalExpression = 'ConditionalExpression',
  CallExpression = 'CallExpression',
  ChainExpression = 'ChainExpression',
}

export type ResolveNodeProps<N extends Node> = {
  node: N
  scope: Scope
  raiseError: (
    { code, message }: { code: string; message: string },
    node: Node,
  ) => never
  supportedMethods: Record<string, SupportedMethod>
  willInterpolate: boolean
  resolveFn: ResolveFn
}

export type ReadNodeMetadataProps<N extends Node> = {
  node: N
  supportedMethods: Record<string, SupportedMethod>
}
