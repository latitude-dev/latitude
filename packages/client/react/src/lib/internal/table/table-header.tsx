import * as React from 'react'
import { theme } from '@latitude-data/client'

interface Props extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, Props>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={theme.ui.table.header.cssClass({ className })}
      {...props}
    />
  ),
)
TableHeader.displayName = 'TableHeader'

export default TableHeader
