import { describe, it, expect } from 'vitest'
import { getDataset } from './getDataset'

describe('getDataset', () => {
  it('should return DatasetOption with sourceHeader and stringified source', () => {
    const mockDataset = {
      fields: ['Country', 'Population', 'Area'],
      source: [
        ['USA', '331', '9834'],
        ['Canada', '38', '9984']
      ]
    }
    const result = getDataset({ dataset: mockDataset })
    expect(result).toEqual({
      datasetIndex: 0,
      datasets: [{
        dimensions: ['Country', 'Population', 'Area'],
        source: [
          ['USA', 331, 9834],
          ['Canada', 38, 9984]
        ]
      }]
    })
  })

  it('should calculate percentages if usePercentage is true', () => {
    const mockDataset = {
      fields: ['Country', 'Population', 'Area'],
      source: [
        ['USA', 331, 9834],
        ['Canada', 38, 9984]
      ]
    }
    const result = getDataset({ dataset: mockDataset, normalizeValues: true })
    const calculatePercentage = (value: number, total: number) => (value / total)
    expect(result).toEqual({
      datasetIndex: 0,
      datasets: [{
        dimensions: ['Country', 'Population', 'Area'],
        source: [
          ['USA', calculatePercentage(331, 331 + 9834), calculatePercentage(9834, 331 + 9834)],
          ['Canada', calculatePercentage(38, 38 + 9984), calculatePercentage(9984, 38 + 9984)]
        ]
      }]
    })
  })

  it('should sort dataset by column if axisType is time', () => {
    const mockDataset = {
      fields: ['Date', 'Value'],
      source: [
        ['2021-01-02', 20],
        ['2021-01-01', 10]
      ]
    }
    const result = getDataset({
      dataset: mockDataset,
      sort: {
        column: 'Date',
        order: 'asc',
        parser: 'time'
      }
    })
    expect(result).toEqual({
      datasetIndex: 1,
      datasets: [
        {
          dimensions: ['Date', 'Value'],
          source: [
            ['2021-01-02', 20],
            ['2021-01-01', 10]
          ]
        },
        {
          transform: {
            type: 'sort',
            config: [{
              dimension: 'Date',
              order: 'asc',
              incomparable: undefined,
              parser: 'time'
            }]
          }
        }
      ]
    })
  })
})

