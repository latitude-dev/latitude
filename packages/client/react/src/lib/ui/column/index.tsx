import * as React from 'react'
import { theme } from '@latitude-data/client'
interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Column = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={theme.ui.column.cssClass({ className })}
      {...props}
    />
  ),
)
Column.displayName = 'Column'

export default Column
