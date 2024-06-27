import { BuildSupportedMethodsArgs } from '$/types'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'
import { QueryResultArray } from '@latitude-data/query_result'

type Col = {
  name: string
  values: string[]
  maxLength: number
}

function padSpaces(str: string, length: number) {
  return str + ' '.repeat(Math.max(0, length - str.length))
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

    const cols: Col[] = []

    value.forEach((row, i) => {
      Object.entries(row).forEach(([col, val]) => {
        let colIndex = cols.findIndex((c) => c.name === col)
        if (colIndex === -1) {
          colIndex = cols.length
          cols.push({
            name: col,
            values: Array(value.length).fill(''), // Fill with empty strings
            maxLength: 0,
          })
        }

        const valStr = String(val).replace(/\n/g, '\\n')
        cols[colIndex]!.values[i] = valStr

        if (valStr.length > cols[colIndex]!.maxLength) {
          cols[colIndex]!.maxLength = valStr.length
        }
      })
    })

    let table = ''

    // Add header row
    table +=
      '| ' +
      cols.map((c) => padSpaces(c.name, c.maxLength)).join(' | ') +
      ' |\n'
    table +=
      '|-' + cols.map((c) => '-'.repeat(c.maxLength)).join('-|-') + '-|\n'

    // Add data rows
    value.forEach((_, i) => {
      const cells = cols.map((c) => padSpaces(c.values[i]!, c.maxLength))
      table += '| ' + cells.join(' | ') + ' |\n'
    })

    return table
  },

  readMetadata: async () => {
    return emptyMetadata()
  },
})

export default buildCastMethod
