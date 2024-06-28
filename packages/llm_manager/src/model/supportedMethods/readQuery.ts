import { BuildSupportedMethodsArgs, Params } from '$/types'
import { ResolvedParam } from '@latitude-data/source-manager'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'

const buildReadQueryMethod = ({
  model,
}: BuildSupportedMethodsArgs): SupportedMethod => ({
  requirements: {
    interpolationPolicy: 'allow', // Cannot be directly interpolated
    interpolationMethod: 'raw', // When interpolating, use parameterization
    requireStaticArguments: false, // Can only use static arguments
  },

  resolve: async (queryPath: string, params?: Params) => {
    if (typeof queryPath !== 'string') {
      throw new Error('Invalid reference prompt')
    }

    const source = await model.manager.sourceManager.loadFromQuery(queryPath)
    const compiledQuery = await source.compileQuery({
      queryPath,
      params,
    })

    // Replace resolved params with the actual values
    let query = compiledQuery.sql
    compiledQuery.resolvedParams.forEach((param: ResolvedParam) => {
      const value = param.value
      const resolvedAs = param.resolvedAs

      // Replace only the first occurrence of the resolvedAs value
      // Some connectors may resolve all params with the same character, so the only
      // way to know which is which is by its appearance in the query
      const regex = new RegExp(`\\${resolvedAs}`, 'g')

      query = query.replace(regex, value as string)
    })

    return query
  },

  readMetadata: async () => {
    return emptyMetadata()
  },
})

export default buildReadQueryMethod
