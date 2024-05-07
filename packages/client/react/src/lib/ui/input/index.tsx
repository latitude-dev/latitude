import * as React from 'react'
import { theme } from '@latitude-data/client'
import { cn } from 'src/lib/utils'
import { Text, Label } from 'src/lib/ui'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
type Props = InputProps & {
  label?: string
  description?: string
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, label, description, name, type, ...props }, ref) => {
    return (
      <div className={theme.ui.input.WRAPPER_CSS_CLASS}>
        {label && <Label htmlFor={name}>{label}</Label>}
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {description && (
          <Text size='h5' color='muted'>
            {description}
          </Text>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export default Input
