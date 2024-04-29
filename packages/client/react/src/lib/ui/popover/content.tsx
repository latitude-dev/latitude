import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { theme } from '@latitude-data/client'

interface Props
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  Props
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={theme.ui.popover.cssClass({ className })}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export default PopoverContent
