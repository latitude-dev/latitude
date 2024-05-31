import { BuildSupportedMethodsArgs } from '@/types'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'

const buildParamMethod = ({
  context,
}: BuildSupportedMethodsArgs): SupportedMethod => ({
  requirements: {
    interpolationPolicy: 'allow', // Results can be interpolated
    interpolationMethod: 'parameterize', // When interpolating, use parameterization
    requireStaticArguments: false, // Can be used with variables or logic expressions
  },

  resolve: async (name: string, defaultValue?: unknown) => {
    const requestParams = context.request.params ?? {}
    if (typeof name !== 'string') throw new Error('Invalid parameter name')
    if (!(name in requestParams) && defaultValue === undefined) {
      throw new Error(`Missing parameter '${name}' in request`)
    }
    if (name in requestParams) {
      context.accessedParams[name] = requestParams[name]
    }
    return name in requestParams ? requestParams[name] : defaultValue
  },

  readMetadata: async () => {
    return emptyMetadata()
  },
})

export default buildParamMethod
