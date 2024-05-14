import { EchartTheme, TailwindAttributes } from './types'
import { removeUndefined } from './utils'

export default function buildEchartsTheme(
  attrs: Partial<TailwindAttributes>,
): Partial<EchartTheme> {
  // Echarts theme attributes are by default sourced from the regular Latitude theme attributes
  const echartsTheme = {
    backgroundColor: attrs['background'],
    titleColor: attrs['foreground'],
    subtitleColor: attrs['muted-foreground'],
    textColor: attrs['foreground'],
    markTextColor: attrs['primary-foreground'],
    borderColor: attrs['border'],
    legendTextColor: attrs['muted-foreground'],
    kColor: attrs['primary'],
    kBorderColor: attrs['primary'],
    kBorderColor0: attrs['destructive'],
    graphLineColor: attrs['border'],
    mapLabelColor: attrs['foreground'],
    mapLabelColorE: attrs['primary'],
    mapBorderColor: attrs['muted'],
    mapBorderColorE: attrs['primary'],
    mapAreaColor: attrs['muted'],
    mapAreaColorE: attrs['primary-foreground'],
    toolboxColor: attrs['muted-foreground'],
    toolboxEmphasisColor: attrs['foreground'],
    tooltipAxisColor: attrs['border'],
    timelineLineColor: attrs['secondary-foreground'],
    timelineItemColor: attrs['muted-foreground'],
    timelineItemColorE: attrs['muted-foreground'],
    timelineCheckColor: attrs['background'],
    timelineCheckBorderColor: attrs['primary'],
    timelineControlColor: attrs['secondary-foreground'],
    timelineControlBorderColor: attrs['secondary-foreground'],
    timelineLabelColor: attrs['secondary-foreground'],
    datazoomBackgroundColor: attrs['background'],
    datazoomDataColor: attrs['border'],
    datazoomFillColor: attrs['muted'],
    datazoomHandleColor: attrs['border'],
    datazoomLabelColor: attrs['muted-foreground'],
  }

  return removeUndefined(echartsTheme) as Partial<EchartTheme>
}
