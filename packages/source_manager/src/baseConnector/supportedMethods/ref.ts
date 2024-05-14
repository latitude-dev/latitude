import { BuildSupportedMethodsArgs } from '@/types'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'
import { assertNoCyclicReferences, getFullQueryPath } from '../utils'
import { createHash } from 'crypto'

const buildRefMethod = ({
  source,
  context,
}: BuildSupportedMethodsArgs): SupportedMethod => ({
  requirements: {
    interpolationPolicy: 'require', // Cannot be used inside a logic block
    interpolationMethod: 'raw', // When interpolating, will just inject the returned value directly into the query
    requireStaticArguments: true, // Can only use static arguments
  },

  resolve: async (referencedQuery: string) => {
    if (typeof referencedQuery !== 'string') {
      throw new Error('Invalid reference query')
    }

    const fullSubQueryPath = getFullQueryPath({
      referencedQueryPath: referencedQuery,
      currentQueryPath: context.request.queryPath,
    })

    assertNoCyclicReferences(fullSubQueryPath, context.queriesBeingCompiled)

    const refSource = await source.manager.loadFromQuery(fullSubQueryPath)
    if (refSource !== source) {
      throw new Error('Query reference to a different source')
    }

    const refRequest = {
      queryPath: fullSubQueryPath,
      params: context.request.params,
    }
    const { request: _, ...refContext } = context // Everything except request is passed to the subquery context
    const compiledSubQuery = await source.compileQuery(refRequest, refContext)

    return `(${compiledSubQuery.sql})`
  },

  readMetadata: async (args?: unknown[]) => {
    const [referencedQuery] = args!
    const fullSubQueryPath = getFullQueryPath({
      referencedQueryPath: referencedQuery as string,
      currentQueryPath: context.request.queryPath,
    })
    const { rawSql, ...rest } =
      await source.getMetadataFromQuery(fullSubQueryPath)
    const sqlHash = createHash('sha256').update(rawSql!).digest('hex')
    return {
      ...rest,
      config: emptyMetadata().config, // The config from the referenced query is not relevant for the parent query
      sqlHash,
    }
  },
})

export default buildRefMethod
