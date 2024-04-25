import { Card, Column, Row } from '$src'
import type { theme } from '@latitude-data/client'
import DownloadTooltip from './DownloadTooltip'

interface VisualizationHeaderProps {
  title?: string
  description?: string
  headerType?: theme.ui.card.CardProps['type']
  headerAction?: (element: HTMLDivElement) => { destroy: () => void }
  download?: () => Promise<void>
}

function VisualizationHeader({
  title,
  description,
  headerType = 'invisible',
  headerAction,
  download,
}: VisualizationHeaderProps) {
  if (!title && !description && !download) return null
  return (
    <Card.Header type={headerType} action={headerAction}>
      <Row className='lat-gap-6'>
        <Column className='lat-flex-1 lat-gap-2'>
          {title && <Card.Title>{title}</Card.Title>}
          {description && <Card.Description>{description}</Card.Description>}
        </Column>
        {download && (
          <Column>
            <DownloadTooltip download={download} />
          </Column>
        )}
      </Row>
    </Card.Header>
  )
}

export default VisualizationHeader
