import { PartialThemeAttributes } from './types'
import { removeUndefined } from './utils'

export default function addDefaultAttributes(
  attrs: PartialThemeAttributes,
): PartialThemeAttributes {
  const filledAttrs = {
    card: attrs['background'],
    'card-foreground': attrs['foreground'],
    popover: attrs['background'],
    'popover-foreground': attrs['foreground'],
  }

  return {
    ...(removeUndefined(filledAttrs) as PartialThemeAttributes),
    ...attrs,
  }
}
