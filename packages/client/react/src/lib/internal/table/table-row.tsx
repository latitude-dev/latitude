import * as React from 'react'
import { theme } from '@latitude-data/client'

interface Props extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
}

const TableRow = React.forwardRef<HTMLTableRowElement, Props>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={theme.ui.table.row.cssClass({ className })}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

export default TableRow
