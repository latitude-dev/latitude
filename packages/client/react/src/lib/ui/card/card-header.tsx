import * as React from 'react'
import { theme } from '@latitude-data/client'
type Props = React.HTMLAttributes<HTMLDivElement> &
  theme.ui.card.CardProps & {
    action?: (element: HTMLDivElement) => { destroy: () => void }
  }

const CardHeader = React.forwardRef<HTMLDivElement, Props>(
  ({ className, type, ...props }, ref) => (
    <div
      ref={ref}
      className={theme.ui.card.headerCssClass({ type, className })}
      {...props}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

export default CardHeader
