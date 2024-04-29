import * as React from 'react'
import { theme } from '@latitude-data/client'

interface Props extends React.HTMLAttributes<HTMLTableElement> {
  className?: string
}

const Table = React.forwardRef<HTMLTableElement, Props>(
  ({ className, ...props }, ref) => (
    <div className={theme.ui.table.container.cssClass({ className })}>
      <table
        ref={ref}
        className={theme.ui.table.root.cssClass({})}
        {...props}
      />
    </div>
  ),
)
Table.displayName = 'Table'

export default Table
