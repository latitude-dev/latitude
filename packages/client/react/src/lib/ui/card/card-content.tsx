import * as React from 'react'
import { theme } from '@latitude-data/client'
type Props = React.HTMLAttributes<HTMLDivElement> & theme.ui.card.CardProps

const CardContent = React.forwardRef<HTMLDivElement, Props>(
  ({ className, type, ...props }, ref) => (
    <div
      ref={ref}
      className={theme.ui.card.contentCssClass({ type, className })}
      {...props}
    />
  ),
)
CardContent.displayName = 'CardContent'

export default CardContent
