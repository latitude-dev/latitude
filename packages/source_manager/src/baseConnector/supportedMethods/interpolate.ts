import { BuildSupportedMethodsArgs } from '@/types'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'

const buildInterpolateMethod = (
  _: BuildSupportedMethodsArgs,
): SupportedMethod => ({
  requirements: {
    interpolationPolicy: 'require', // Cannot be used inside a logic block
    interpolationMethod: 'raw', // When interpolating, will just inject the value directly into the query
    requireStaticArguments: false, // Can be used with variables or logic expressions
  },

  resolve: async (value: unknown) => {
    return String(value)
  },

  readMetadata: async () => {
    return emptyMetadata()
  },
})

export default buildInterpolateMethod
