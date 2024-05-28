import { BuildSupportedMethodsArgs } from '@/types'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'

const buildCastMethod = (_: BuildSupportedMethodsArgs): SupportedMethod => ({
  requirements: {
    interpolationPolicy: 'allow', // Results can be interpolated
    interpolationMethod: 'parameterize', // When interpolating, use parameterization
    requireStaticArguments: false, // Can be used with variables or logic expressions
  },

  resolve: async (value: unknown, type: string) => {
    if (!(type in CAST_METHODS)) {
      throw new Error(
        `Unsupported cast type: '${type}'. Supported types are: ${Object.keys(
          CAST_METHODS,
        ).join(', ')}`,
      )
    }
    return CAST_METHODS[type]!(value)
  },

  readMetadata: async () => {
    return emptyMetadata()
  },
})

const CAST_METHODS: {
  [type: string]: (value: any) => unknown
} = {
  string: (value) => String(value),
  text: (value) => String(value),
  int: (value) => parseInt(value),
  float: (value) => parseFloat(value),
  number: (value) => Number(value),
  bool: (value) => Boolean(value),
  boolean: (value) => Boolean(value),
  date: (value) => new Date(value),
}

export default buildCastMethod
