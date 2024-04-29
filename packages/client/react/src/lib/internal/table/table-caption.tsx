import * as React from 'react'
import { theme } from '@latitude-data/client'

interface Props extends React.HTMLAttributes<HTMLTableCaptionElement> {
  className?: string
}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, Props>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={theme.ui.table.caption.cssClass({ className })}
      {...props}
    />
  ),
)
TableCaption.displayName = 'TableCaption'

export default TableCaption
