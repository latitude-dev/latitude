import * as React from 'react'
import { theme } from '@latitude-data/client'
import AlertText from './text'

type Props = React.HTMLAttributes<HTMLDivElement> &
  theme.ui.alert.Props & {
    html?: boolean
    centerText?: boolean
    fontWeight?: 'normal' | 'bold'
  }

const Alert = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      type,
      scrollable,
      centerText,
      fontWeight,
      html,
      secondary,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const styles = theme.ui.alert.cssClass({
      type,
      scrollable,
      secondary,
      className,
    })

    const textColor = styles.properties.foreground

    return (
      <div ref={ref} className={styles.root} {...props} role='alert'>
        {html ? (
          children
        ) : (
          <AlertText
            color={textColor}
            centered={centerText}
            fontWeight={fontWeight}
          >
            {children}
          </AlertText>
        )}
      </div>
    )
  },
)

export default Alert
