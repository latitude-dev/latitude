import React from 'react'
import type { theme } from '@latitude-data/client'
import Text from './Text'
type Props = React.HTMLAttributes<HTMLHeadingElement> &
  theme.ui.text.HeaderProps

function H5(props: Props) {
  return <Text size='h5' leading='h5' as='h5' {...props} />
}

export default H5
