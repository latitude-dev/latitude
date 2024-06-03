import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { theme } from '@latitude-data/client'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

type Props = ButtonProps & {
  variant?: theme.ui.button.Variant
  size?: theme.ui.button.Size
}

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        type='button'
        className={theme.ui.button.cssClass({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export default Button
