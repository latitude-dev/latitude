export const alignItems = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
}

export const justifyContent = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
}

export const flexDirection = {
  row: 'flex-row',
  column: 'flex-col',
}

export type FlexDirection = keyof typeof flexDirection
export type JustifyContent = keyof typeof justifyContent
export type AlignItems = keyof typeof alignItems
