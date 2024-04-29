import React from 'react'
import type { theme } from '@latitude-data/client'
import Text from './Text'
type Props = React.HTMLAttributes<HTMLHeadingElement> &
  theme.ui.text.HeaderProps

function H6(props: Props) {
  return <Text size='h6' leading='h6' as='h6' {...props} />
}

export default H6
