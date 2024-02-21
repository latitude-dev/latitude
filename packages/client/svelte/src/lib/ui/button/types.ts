import type { Button as ButtonPrimitive } from 'bits-ui'
import { theme } from '@latitude-sdk/client'

type Props = Omit<ButtonPrimitive.Props, 'class'> & {
  variant?: theme.ui.button.Variant
  size?: theme.ui.button.Size
  class?: string | null | undefined
}
type Events = ButtonPrimitive.Events

export { type Props as ButtonProps, type Events as ButtonEvents }
