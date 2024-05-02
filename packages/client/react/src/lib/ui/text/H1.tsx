import React from 'react'
import type { theme } from '@latitude-data/client'
import Text from './Text'
type Props = React.HTMLAttributes<HTMLHeadingElement> &
  theme.ui.text.HeaderProps

function H1(props: Props) {
  return <Text size='h1' leading='h1' as='h1' {...props} />
}

export default H1
