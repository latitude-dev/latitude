import QueryResult, { DataType } from '.'
import { describe, it, expect } from 'vitest'

describe('QueryResult.toCSV', () => {
  it('should properly serialize a simple dataset to CSV', () => {
    const queryResult = new QueryResult({
      fields: [
        { name: 'id', type: DataType.Integer },
        { name: 'name', type: DataType.String },
      ],
      rows: [
        [1, 'Alice'],
        [2, 'Bob'],
      ],
    })

    const csv = queryResult.toCSV()
    expect(csv).toBe('id,name\n1,Alice\n2,Bob')
  })

  it('should handle special characters correctly in CSV', () => {
    const queryResult = new QueryResult({
      fields: [{ name: 'quote', type: DataType.String }],
      rows: [['"Hello, World!"']],
    })

    const csv = queryResult.toCSV()
    expect(csv).toBe('quote\n"""Hello, World!"""')
  })

  it('returns header only for empty dataset', () => {
    const queryResult = new QueryResult({
      fields: [
        { name: 'id', type: DataType.Integer },
        { name: 'name', type: DataType.String },
      ],
    })

    const csv = queryResult.toCSV()
    expect(csv).toBe('\n')
  })

  it('should handle BigInt values correctly', () => {
    const queryResult = new QueryResult({
      fields: [{ name: 'id', type: DataType.Integer }],
      rows: [[BigInt(1)]],
    })

    const csv = queryResult.toCSV()
    expect(csv).toBe('id\n1')
  })

  it('should handle null values correctly', () => {
    const queryResult = new QueryResult({
      fields: [{ name: 'id', type: DataType.Integer }],
      rows: [[null]],
    })

    const csv = queryResult.toCSV()
    expect(csv).toBe('id\nnull')
  })

  it('should handle strings with commas correctly', () => {
    const queryResult = new QueryResult({
      fields: [{ name: 'name', type: DataType.String }],
      rows: [
        [
          'Chhota Bheem Aur Krishna vs Zimbara is an Indian animated movie featuring Bheem,...',
        ],
      ],
    })

    const csv = queryResult.toCSV()
    expect(csv).toBe(
      'name\n"Chhota Bheem Aur Krishna vs Zimbara is an Indian animated movie featuring Bheem,..."',
    )
  })
})
