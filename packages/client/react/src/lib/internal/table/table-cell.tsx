import * as React from 'react'
import { theme } from '@latitude-data/client'

interface Props extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string
}

const TableCell = React.forwardRef<HTMLTableCellElement, Props>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={theme.ui.table.cell.cssClass({ className })}
      {...props}
    />
  ),
)
TableCell.displayName = 'TableCell'

export default TableCell
