import { describe, it, expect } from 'vitest'
import buildEchartsTheme from './buildEchartsTheme'
import { TailwindAttributes, EchartTheme } from './types'

describe('buildEchartsTheme', () => {
  it('should build an Echarts theme with all attributes provided', () => {
    const attrs: Partial<TailwindAttributes> = {
      background: 'background',
      foreground: 'foreground',
      'muted-foreground': 'muted_foreground',
      'primary-foreground': 'primary_foreground',
      border: 'border',
      primary: 'primary',
      destructive: 'destructive',
      muted: 'muted',
      'secondary-foreground': 'secondary_foreground',
    }

    const expected: Partial<EchartTheme> = {
      backgroundColor: 'background',
      titleColor: 'foreground',
      subtitleColor: 'muted_foreground',
      textColor: 'foreground',
      markTextColor: 'primary_foreground',
      borderColor: 'border',
      legendTextColor: 'muted_foreground',
      kColor: 'primary',
      kBorderColor: 'primary',
      kBorderColor0: 'destructive',
      graphLineColor: 'border',
      mapLabelColor: 'foreground',
      mapLabelColorE: 'primary',
      mapBorderColor: 'muted',
      mapBorderColorE: 'primary',
      mapAreaColor: 'muted',
      mapAreaColorE: 'primary_foreground',
      toolboxColor: 'muted_foreground',
      toolboxEmphasisColor: 'foreground',
      tooltipAxisColor: 'border',
      timelineLineColor: 'secondary_foreground',
      timelineItemColor: 'muted_foreground',
      timelineItemColorE: 'muted_foreground',
      timelineCheckColor: 'background',
      timelineCheckBorderColor: 'primary',
      timelineControlColor: 'secondary_foreground',
      timelineControlBorderColor: 'secondary_foreground',
      timelineLabelColor: 'secondary_foreground',
      datazoomBackgroundColor: 'background',
      datazoomDataColor: 'border',
      datazoomFillColor: 'muted',
      datazoomHandleColor: 'border',
      datazoomLabelColor: 'muted_foreground',
    }

    const result = buildEchartsTheme(attrs)
    expect(result).toEqual(expected)
  })

  it('should omit attributes that are undefined', () => {
    const attrs: Partial<TailwindAttributes> = {
      background: 'background',
      foreground: undefined,
      'primary-foreground': 'primary_foreground',
    }

    const expected: Partial<EchartTheme> = {
      backgroundColor: 'background',
      datazoomBackgroundColor: 'background',
      markTextColor: 'primary_foreground',
      mapAreaColorE: 'primary_foreground',
      timelineCheckColor: 'background',
    }

    const result = buildEchartsTheme(attrs)
    expect(result).toEqual(expected)
  })

  it('should handle an empty attributes object', () => {
    const attrs: Partial<TailwindAttributes> = {}

    const expected: Partial<EchartTheme> = {}

    const result = buildEchartsTheme(attrs)
    expect(result).toEqual(expected)
  })

  it('should handle attributes with only a few defined values', () => {
    const attrs: Partial<TailwindAttributes> = {
      foreground: 'foreground',
      border: 'border',
    }

    const expected: Partial<EchartTheme> = {
      titleColor: 'foreground',
      textColor: 'foreground',
      borderColor: 'border',
      graphLineColor: 'border',
      mapLabelColor: 'foreground',
      toolboxEmphasisColor: 'foreground',
      tooltipAxisColor: 'border',
      datazoomDataColor: 'border',
      datazoomHandleColor: 'border',
    }

    const result = buildEchartsTheme(attrs)
    expect(result).toEqual(expected)
  })

  it('should not mutate the input attributes object', () => {
    const attrs: Partial<TailwindAttributes> = {
      background: 'background',
      foreground: 'foreground',
    }

    const attrsClone = { ...attrs }

    buildEchartsTheme(attrs)

    expect(attrs).toEqual(attrsClone)
  })
})
