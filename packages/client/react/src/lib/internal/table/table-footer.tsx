import * as React from 'react'
import { theme } from '@latitude-data/client'

interface Props extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, Props>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={theme.ui.table.footer.cssClass({ className })}
      {...props}
    />
  ),
)
TableFooter.displayName = 'TableFooter'

export default TableFooter
