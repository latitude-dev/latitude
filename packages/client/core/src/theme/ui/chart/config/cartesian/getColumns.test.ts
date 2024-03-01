import { describe, it, expect } from 'vitest'
import { getColumns } from './getColumns'

const FIELDS = ['country', 'movies_1', 'shows', 'movies_2']
describe('getColumns', () => {
  it('should return a full column', () => {
    const column = getColumns({
      column: 'country',
      chartType: 'bar',
      fields: FIELDS,
    })
    expect(column).toEqual([
      {
        name: 'country',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'country',
      },
    ])
  })

  it('should return a full column with a column object', () => {
    const column = getColumns({
      column: { name: 'country', chartType: 'line' },
      chartType: 'bar',
      fields: FIELDS,
    })
    expect(column).toEqual([
      {
        name: 'country',
        chartType: 'line',
        axisIndex: 0,
        displayName: 'country',
      },
    ])
  })

  it('accepts displayName', () => {
    const column = getColumns({
      column: {
        name: 'country',
        displayName: 'The Country',
        chartType: 'area',
      },
      chartType: 'bar',
      fields: FIELDS,
    })
    expect(column).toEqual([
      {
        name: 'country',
        chartType: 'area',
        axisIndex: 0,
        displayName: 'The Country',
      },
    ])
  })

  it('accepts axisIndex', () => {
    const column = getColumns({
      column: { name: 'country', axisIndex: 42, chartType: 'area' },
      chartType: 'bar',
      fields: FIELDS,
    })
    expect(column).toEqual([
      {
        name: 'country',
        chartType: 'area',
        axisIndex: 42,
        displayName: 'country',
      },
    ])
  })

  it('accepts an array of columns', () => {
    const column = getColumns({
      column: ['country', 'movies'],
      chartType: 'bar',
      fields: FIELDS,
    })
    expect(column).toEqual([
      {
        name: 'country',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'country',
      },
      {
        name: 'movies',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'movies',
      },
    ])
  })

  it('accepts an array of column objects and strings', () => {
    const column = getColumns({
      column: [{ name: 'country', chartType: 'line' }, 'movies'],
      chartType: 'bar',
      fields: FIELDS,
    })
    expect(column).toEqual([
      {
        name: 'country',
        chartType: 'line',
        axisIndex: 0,
        displayName: 'country',
      },
      {
        name: 'movies',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'movies',
      },
    ])
  })

  it('accepts a wilcard *', () => {
    const column = getColumns({
      column: ['country', 'movies_*'],
      chartType: 'bar',
      fields: FIELDS,
    })
    expect(column).toEqual([
      {
        name: 'country',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'country',
      },
      {
        name: 'movies_1',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'movies_1',
      },
      {
        name: 'movies_2',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'movies_2',
      },
    ])
  })

  it('accepts a wilcard * at the begining', () => {
    const column = getColumns({
      column: ['*_movies', 'country'],
      chartType: 'bar',
      fields: ['1_movies', '2_movies', 'country'],
    })
    expect(column).toEqual([
      {
        name: '1_movies',
        chartType: 'bar',
        axisIndex: 0,
        displayName: '1_movies',
      },
      {
        name: '2_movies',
        chartType: 'bar',
        axisIndex: 0,
        displayName: '2_movies',
      },
      {
        name: 'country',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'country',
      },
    ])
  })

  it('keeps order with wildcards', () => {
    const column = getColumns({
      column: [
        'country',
        'movies_*',
        {
          name: 'shows',
          chartType: 'line',
          axisIndex: 1,
          displayName: 'Daily Shows',
        },
      ],
      chartType: 'bar',
      fields: FIELDS,
    })
    expect(column).toEqual([
      {
        name: 'country',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'country',
      },
      {
        name: 'movies_1',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'movies_1',
      },
      {
        name: 'movies_2',
        chartType: 'bar',
        axisIndex: 0,
        displayName: 'movies_2',
      },
      {
        name: 'shows',
        chartType: 'line',
        axisIndex: 1,
        displayName: 'Daily Shows',
      },
    ])
  })
})
