import { BuildSupportedMethodsArgs } from '$/types'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'
import { QueryResultArray } from '@latitude-data/query_result'
import { json2csv } from 'json-2-csv'

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

    return json2csv(value, {
      keys: value[0] ? Object.keys(value[0]) : [],
      expandArrayObjects: false,
      expandNestedObjects: false,
    })
  },

  readMetadata: async () => {
    return emptyMetadata()
  },
})

export default buildCastMethod
