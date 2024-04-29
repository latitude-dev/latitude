import * as React from 'react'
import { theme } from '@latitude-data/client'
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type Props = React.HTMLAttributes<HTMLHeadingElement> & {
  className?: string
  tag?: HeadingLevel
}

const CardTitle = React.forwardRef<HTMLParagraphElement, Props>(
  ({ className, tag, ...props }, ref) => {
    const Tag = tag || 'h3'

    return (
      <Tag
        ref={ref}
        className={theme.ui.card.titleCssClass({ className })}
        {...props}
      />
    )
  },
)
CardTitle.displayName = 'CardTitle'

export default CardTitle
