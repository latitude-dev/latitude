import React from 'react'
import type { theme } from '@latitude-data/client'
import Text from './Text'
type Props = React.HTMLAttributes<HTMLHeadingElement> &
  theme.ui.text.HeaderProps

function H2(props: Props) {
  return <Text size='h2' leading='h2' as='h2' {...props} />
}

export default H2
