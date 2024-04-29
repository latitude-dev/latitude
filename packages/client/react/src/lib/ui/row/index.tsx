import * as React from 'react'
import { theme } from '@latitude-data/client'
interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Row = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={theme.ui.row.cssClass({ className })}
      {...props}
    />
  ),
)
Row.displayName = 'Row'

export default Row
