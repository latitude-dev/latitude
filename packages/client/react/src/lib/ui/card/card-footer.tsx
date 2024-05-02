import * as React from 'react'
import { theme } from '@latitude-data/client'
interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={theme.ui.card.footerCssClass({ className })}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

export default CardFooter
