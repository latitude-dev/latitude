import React from 'react'
import type { theme } from '@latitude-data/client'
import Text from './Text'
type Props = React.HTMLAttributes<HTMLHeadingElement> &
  theme.ui.text.HeaderProps

function H3(props: Props) {
  return <Text size='h3' leading='h3' as='h3' {...props} />
}

export default H3
