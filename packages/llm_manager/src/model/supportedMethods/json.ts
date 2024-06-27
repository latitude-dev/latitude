import { BuildSupportedMethodsArgs } from '$/types'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'
import { QueryResultArray } from '@latitude-data/query_result'

function removeBigInts(results: QueryResultArray) {
  results.forEach((row, i) => {
    Object.entries(row).forEach(([key, value]) => {
      if (typeof value === 'bigint') {
        results[i]![key] = Number(value)
      }
    })
  })
}

const buildCastMethod = (_: BuildSupportedMethodsArgs): SupportedMethod => ({
  requirements: {
    interpolationPolicy: 'require', // Results can be interpolated
    interpolationMethod: 'raw', // When interpolating, use the raw value
    requireStaticArguments: false, // Can be used with variables or logic expressions
  },

  resolve: async (value: QueryResultArray) => {
    // Check value is the correct type (array of objects)
    if (!Array.isArray(value) || !value.every((v) => typeof v === 'object')) {
      throw new Error('Value must be a query result.')
    }

    removeBigInts(value)
    return JSON.stringify(value)
  },

  readMetadata: async () => {
    return emptyMetadata()
  },
})

export default buildCastMethod
