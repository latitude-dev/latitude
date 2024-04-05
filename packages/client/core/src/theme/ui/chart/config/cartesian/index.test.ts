import { describe, it, expect } from 'vitest'
import generateConfig from './index'
import { DATASET, testData } from './__mocks__/data'

describe('generateConfig', () => {
  it('simple config', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        y: { name: 'movies_1', chartType: 'bar' },
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
        y: 'movies_1',
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
        y: ['shows', { name: 'movies_1', chartType: 'bar' }],
      }),
    ).toEqual({
      ...testData,
      series: [
        {
          ...testData.series[0],
          name: 'shows',
          xAxisIndex: 0,
          encode: { x: 'country', y: 'shows' },
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

  it('accepts a wilcard * for y', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        y: [
          { name: 'movies_*', chartType: 'line' },
          { name: 'shows', chartType: 'bar' },
        ],
      }),
    ).toEqual({
      ...testData,
      series: [
        {
          ...testData.series[0],
          xAxisIndex: 0,
          type: 'line',
        },
        {
          ...testData.series[0],
          xAxisIndex: 0,
          encode: { x: 'country', y: 'movies_2' },
          label: {
            ...testData.series[0]?.label,
            formatter: '{@3}',
          },
          type: 'line',
          name: 'movies_2',
        },
        {
          ...testData.series[0],
          name: 'shows',
          encode: { x: 'country', y: 'shows' },
          label: {
            ...testData.series[0]?.label,
            formatter: '{@2}',
          },
          xAxisIndex: 0,
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
        y: 'movies_1',
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
        chartType: 'line',
        dataset: DATASET,
        x: 'country',
        y: { name: 'movies_1' },
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
        y: { name: 'movies_1', chartType: 'area' },
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
        y: ['movies_1', 'shows'],
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
          encode: { x: 'country', y: 'shows' },
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
          name: 'movies_1',
        },
      ],
    })
  })

  it('Stack 100% bars', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        y: ['movies_1', 'shows'],
        yFormat: { stack: 'normalized' },
      }),
    ).toEqual({
      ...testData,
      dataset: [
        {
          dimensions: ['country', 'movies_1', 'shows', 'movies_2'],
          source: [
            ['CN', 0, 0.970873786407767, 0.02912621359223301],
            ['TW', 0, 0.970873786407767, 0.02912621359223301],
            [
              'KR',
              0.019417475728155338,
              0.9514563106796117,
              0.02912621359223301,
            ],
            [
              'JP',
              0.09803921568627451,
              0.8725490196078431,
              0.029411764705882353,
            ],
            [
              'GB',
              0.12745098039215685,
              0.8431372549019608,
              0.029411764705882353,
            ],
            [
              'ES',
              0.1568627450980392,
              0.8137254901960784,
              0.029411764705882353,
            ],
            [
              'US',
              0.20588235294117646,
              0.7647058823529411,
              0.029411764705882353,
            ],
            [
              'CA',
              0.23148148148148148,
              0.6944444444444444,
              0.07407407407407407,
            ],
            ['AU', 0.2616822429906542, 0.6635514018691588, 0.07476635514018691],
            ['IN', 0.7090909090909091, 0.19090909090909092, 0.1],
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
          encode: { x: 'country', y: 'shows' },
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
          name: 'movies_1',
        },
      ],
    })
  })

  it('swaps the axis', () => {
    expect(
      generateConfig({
        dataset: DATASET,
        x: 'country',
        y: { name: 'movies_1', chartType: 'bar' },
        swapAxis: true,
      }),
    ).toEqual({
      ...testData,
      series: [
        {
          ...testData.series[0],
          yAxisIndex: 0,
          encode: { x: 'movies_1', y: 'country' },
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
