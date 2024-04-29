import * as React from 'react'
import { theme } from '@latitude-data/client'
type Props = React.HTMLAttributes<HTMLDivElement> & theme.ui.card.CardProps

const Card = React.forwardRef<HTMLDivElement, Props>(
  ({ className, type, ...props }, ref) => (
    <div
      ref={ref}
      className={theme.ui.card.rootCssClass({ type, className })}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

export default Card
