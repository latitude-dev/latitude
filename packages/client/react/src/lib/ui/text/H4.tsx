import React from 'react'
import type { theme } from '@latitude-data/client'
import Text from './Text'
type Props = React.HTMLAttributes<HTMLHeadingElement> &
  theme.ui.text.HeaderProps

function H4(props: Props) {
  return <Text size='h4' leading='h4' as='h4' {...props} />
}

export default H4
