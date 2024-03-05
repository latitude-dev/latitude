import latitude from './latitude'

export enum ChartTheme {
  latitude = 'latitude',
}

type ThemeObject = object & {
  visualMapColor: string[]
}
export const THEMES: Record<ChartTheme, ThemeObject> = {
  latitude,
}
