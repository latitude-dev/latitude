import { type SupportedMethod } from '@latitude-data/sql-compiler'
import { BuildSupportedMethodsArgs } from '$/types'

import { default as buildCast } from './cast'
import { default as buildParam } from './param'
import { default as buildRef } from './ref'
import { default as buildRunQuery } from './runQuery'
import { default as buildReadQuery } from './readQuery' 

export default function buildSupportedMethods(
  args: BuildSupportedMethodsArgs,
): Record<string, SupportedMethod> {
  return {
    param: buildParam(args),
    ref: buildRef(args),
    runQuery: buildRunQuery(args),
    cast: buildCast(args),
    readQuery: buildReadQuery(args),
  }
}
