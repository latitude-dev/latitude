import { Popover, Text } from '$src/lib/ui'
import { theme } from '@latitude-data/client'

type Props = {
  download?: () => Promise<void>
}

export default function DownloadTooltip({ download }: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className={theme.ui.downloadTooltip.button()}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='lat-h-6 lat-w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <circle cx='8' cy='12' r='1' fill='currentColor' />
            <circle cx='12' cy='12' r='1' fill='currentColor' />
            <circle cx='16' cy='12' r='1' fill='currentColor' />
          </svg>
        </div>
      </Popover.Trigger>
      <Popover.Content
        align='end'
        className={theme.ui.downloadTooltip.content()}
        style={{ boxShadow: theme.ui.downloadTooltip.CONTENT_BOX_SHADOW }}
      >
        <button
          className={theme.ui.downloadTooltip.option()}
          onClick={download}
        >
          <Text size='h5' weight='medium' color='gray800'>
            Download as CSV
          </Text>
        </button>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  )
}
