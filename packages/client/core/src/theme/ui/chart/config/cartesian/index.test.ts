import { describe, it, expect } from 'vitest'
import generateConfig from './index'
import { DATASET, testData } from './__mocks__/data'

describe('generateConfig', () => {
  it('simple config', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        y: { name: 'movies', chartType: 'bar' },
      }),
    ).toEqual({
      ...testData,
      series: [
        {
          ...testData.series[0],
          xAxisIndex: 0,
        },
      ],
    })
  })

  it('disable animation', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        animation: false,
        x: 'country',
        y: 'movies',
      }),
    ).toEqual({
      ...testData,
      animation: false,
      series: [
        {
          ...testData.series[0],
          xAxisIndex: 0,
        },
      ],
    })
  })

  it('2 columns', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        y: ['shows', { name: 'movies', chartType: 'bar' }],
      }),
    ).toEqual({
      ...testData,
      series: [
        {
          ...testData.series[0],
          name: 'shows',
          xAxisIndex: 0,
          encode: { x: 0, y: 2 },
          label: {
            ...testData.series[0]?.label,
            formatter: '{@2}',
          },
        },
        {
          ...testData.series[0],
          xAxisIndex: 0,
        },
      ],
      yAxis: [
        {
          ...testData.yAxis[0],
          name: 'shows',
        },
      ],
    })
  })

  it('Axis titles', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        xTitle: 'Country axis',
        y: 'movies',
        yTitle: 'Movies and shows',
      }),
    ).toEqual({
      ...testData,
      series: [
        {
          ...testData.series[0],
          xAxisIndex: 0,
        },
      ],
      xAxis: [
        {
          ...testData.xAxis[0],
          name: 'Country axis',
        },
      ],
      yAxis: [
        {
          ...testData.yAxis[0],
          name: 'Movies and shows',
        },
      ],
    })
  })

  it('only line charts', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        y: { name: 'movies', chartType: 'line' },
      }),
    ).toEqual({
      ...testData,
      series: [
        {
          ...testData.series[0],
          type: 'line',
          xAxisIndex: 0,
        },
      ],
      xAxis: [
        {
          ...testData.xAxis[0],
          boundaryGap: false,
        },
      ],
    })
  })

  it('only area charts', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        y: { name: 'movies', chartType: 'area' },
      }),
    ).toEqual({
      ...testData,
      series: [
        {
          ...testData.series[0],
          type: 'line',
          areaStyle: { opacity: 0.4 },
          xAxisIndex: 0,
        },
      ],
      xAxis: [
        {
          ...testData.xAxis[0],
          boundaryGap: false,
        },
      ],
    })
  })

  it('Stack bars', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        animation: false,
        x: 'country',
        y: ['movies', 'shows'],
        yFormat: { stack: true },
      }),
    ).toEqual({
      ...testData,
      animation: false,
      series: [
        {
          ...testData.series[0],
          xAxisIndex: 0,
          stack: 'axis_x_start',
        },
        {
          ...testData.series[0],
          encode: { x: 0, y: 2 },
          label: {
            ...testData.series[0]?.label,
            formatter: '{@2}',
          },
          xAxisIndex: 0,
          name: 'shows',
          stack: 'axis_x_start',
        },
      ],
      yAxis: [
        {
          ...testData.yAxis[0],
          name: 'movies',
        },
      ],
    })
  })

  it('Stack 100% bars', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        y: ['movies', 'shows'],
        yFormat: { stack: 'normalized' },
      }),
    ).toEqual({
      ...testData,
      dataset: [
        {
          sourceHeader: true,
          source: [
            ['country', 'movies', 'shows'],
            ['CN', '0', '1'],
            ['TW', '0', '1'],
            ['KR', '0.02', '0.98'],
            ['JP', '0.10101010101010101', '0.898989898989899'],
            ['GB', '0.13131313131313133', '0.8686868686868687'],
            ['ES', '0.16161616161616163', '0.8383838383838383'],
            ['US', '0.21212121212121213', '0.7878787878787878'],
            ['CA', '0.25', '0.75'],
            ['AU', '0.2828282828282828', '0.7171717171717171'],
            ['IN', '0.7878787878787878', '0.21212121212121213'],
          ],
        },
      ],
      series: [
        {
          ...testData.series[0],
          xAxisIndex: 0,
          stack: 'axis_x_start',
        },
        {
          ...testData.series[0],
          encode: { x: 0, y: 2 },
          label: {
            ...testData.series[0]?.label,
            formatter: '{@2}',
          },
          xAxisIndex: 0,
          name: 'shows',
          stack: 'axis_x_start',
        },
      ],
      yAxis: [
        {
          ...testData.yAxis[0],
          name: 'movies',
        },
      ],
    })
  })

  it('swaps the axis', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        y: { name: 'movies', chartType: 'bar' },
        swapAxis: true,
      }),
    ).toEqual({
      ...testData,
      series: [
        {
          ...testData.series[0],
          yAxisIndex: 0,
          encode: { x: 1, y: 0 },
        },
      ],
      xAxis: [
        {
          ...testData.yAxis[0],
          nameRotate: 0,
          position: 'bottom',
          axisLine: {
            ...testData.yAxis[0]?.axisLine,
            show: false,
          },
        },
      ],
      yAxis: [
        {
          ...testData.yAxis[0],
          name: 'country',
          type: 'category',
          boundaryGap: true,
          axisLine: {
            ...testData.yAxis[0]?.axisLine,
            show: true,
          },
          axisPointer: {
            label: {
              ...testData.yAxis[0]?.axisPointer?.label,
              show: true,
            },
          },
          splitLine: {
            ...testData.yAxis[0]?.splitLine,
            show: false,
          },
        },
      ],
    })
  })
})
