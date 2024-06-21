import { BuildSupportedMethodsArgs, Params } from '$/types'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'

const buildRunQueryMethod = ({
  model,
  context,
}: BuildSupportedMethodsArgs): SupportedMethod => ({
  requirements: {
    interpolationPolicy: 'disallow', // Cannot be directly interpolated
    interpolationMethod: 'raw', // When interpolating, use parameterization
    requireStaticArguments: false, // Can only use static arguments
  },

  resolve: async (queryPath: string, params?: Params) => {
    if (typeof queryPath !== 'string') {
      throw new Error('Invalid reference prompt')
    }

    context.onDebug?.(`Running query: ${queryPath}`)

    const source = await model.manager.sourceManager.loadFromQuery(queryPath)
    const compiledQuery = await source.compileQuery({
      queryPath,
      params,
    })
    const results = await source.runCompiledQuery(compiledQuery)
    return results.toArray()
  },

  readMetadata: async () => {
    return emptyMetadata()
  },
})

export default buildRunQueryMethod
