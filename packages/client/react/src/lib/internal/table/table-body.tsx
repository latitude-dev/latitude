import * as React from 'react'
import { theme } from '@latitude-data/client'

interface Props extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

const TableBody = React.forwardRef<HTMLTableSectionElement, Props>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={theme.ui.table.body.cssClass({ className })}
      {...props}
    />
  ),
)
TableBody.displayName = 'TableBody'

export default TableBody
