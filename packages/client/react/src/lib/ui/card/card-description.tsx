import * as React from 'react'
import { theme } from '@latitude-data/client'
interface Props extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, Props>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={theme.ui.card.descriptionCssClass({ className })}
      {...props}
    />
  ),
)
CardDescription.displayName = 'CardDescription'

export default CardDescription
