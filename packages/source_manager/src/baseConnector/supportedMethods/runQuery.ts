import { BuildSupportedMethodsArgs } from '@/types'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'
import { assertNoCyclicReferences, getFullQueryPath } from '../utils'

const buildRunQueryMethod = ({
  source,
  context,
}: BuildSupportedMethodsArgs): SupportedMethod => ({
  requirements: {
    interpolationPolicy: 'disallow', // Cannot be directly interpolated
    interpolationMethod: 'parameterize', // When interpolating, use parameterization
    requireStaticArguments: false, // Can only use static arguments
  },

  resolve: async (referencedQuery: string) => {
    if (typeof referencedQuery !== 'string') {
      throw new Error('Invalid reference query')
    }

    const fullSubQueryPath = getFullQueryPath({
      referencedQueryPath: referencedQuery,
      currentQueryPath: context.request.queryPath,
    })

    if (fullSubQueryPath in context.ranQueries) {
      return context.ranQueries[fullSubQueryPath]
    }

    assertNoCyclicReferences(fullSubQueryPath, context.queriesBeingCompiled)

    const refSource = await source.manager.loadFromQuery(fullSubQueryPath)

    const refRequest = {
      queryPath: fullSubQueryPath,
      params: context.request.params,
    }
    const refContext = {
      accessedParams: context.accessedParams,
      resolvedParams: [], // Subquery must not access nor modify the parent query's resolved params
      ranQueries: context.ranQueries,
      queriesBeingCompiled: context.queriesBeingCompiled,
    }
    const compiledSubQuery = await refSource.compileQuery(
      refRequest,
      refContext,
    )
    const results = await refSource
      .runCompiledQuery(compiledSubQuery)
      .then((res) => res.toArray())
    context.ranQueries[fullSubQueryPath] = results

    return results
  },

  readMetadata: async () => {
    return emptyMetadata()
  },
})

export default buildRunQueryMethod
