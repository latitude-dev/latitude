import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { theme } from '@latitude-data/client'
import { Text } from 'src/lib/ui'

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} {...props}>
    <Text
      size='h5'
      leading='none'
      weight='normal'
      class={theme.ui.label.cssClass({ className })}
    >
      {children}
    </Text>
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export default Label
