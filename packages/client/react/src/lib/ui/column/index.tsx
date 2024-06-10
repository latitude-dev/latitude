import { theme } from '@latitude-data/client'
import { HTMLAttributes, forwardRef } from 'react'
interface Props extends HTMLAttributes<HTMLDivElement> {}

const Column = forwardRef<HTMLDivElement, Props>(
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
