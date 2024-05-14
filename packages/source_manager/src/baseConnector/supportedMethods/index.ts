import { type SupportedMethod } from '@latitude-data/sql-compiler'
import { BuildSupportedMethodsArgs } from '@/types'

import { default as buildCast } from './cast'
import { default as buildInterpolate } from './interpolate'
import { default as buildParam } from './param'
import { default as buildRef } from './ref'
import { default as buildRunQuery } from './runQuery'

export default function buildSupportedMethods(
  args: BuildSupportedMethodsArgs,
): Record<string, SupportedMethod> {
  return {
    interpolate: buildInterpolate(args),
    param: buildParam(args),
    ref: buildRef(args),
    runQuery: buildRunQuery(args),
    cast: buildCast(args),
  }
}
