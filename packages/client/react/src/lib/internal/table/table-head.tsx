import * as React from 'react'
import { theme } from '@latitude-data/client'

interface Props extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string
}

const TableHead = React.forwardRef<HTMLTableCellElement, Props>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={theme.ui.table.head.cssClass({ className })}
      {...props}
    />
  ),
)
TableHead.displayName = 'TableHead'

export default TableHead
