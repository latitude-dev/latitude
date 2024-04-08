<script lang="ts">
  import { Card, Column, Row } from '$lib'
  import type { theme } from '@latitude-data/client'
  import DownloadTooltip from './DownloadTooltip.svelte'

  export let title: string | undefined = undefined
  export let description: string | undefined = undefined
  export let headerType: theme.ui.card.CardProps['type'] = 'invisible'
  export let headerAction:
    | ((element: HTMLDivElement) => { destroy(): void })
    | undefined = undefined
  export let download: (() => Promise<void> | undefined) | undefined
</script>

{#if title || description || download}
  <Card.Header type={headerType} action={headerAction}>
    <Row class="gap-6">
      <Column class="flex-1 gap-2">
        {#if title}
          <Card.Title>{title}</Card.Title>
        {/if}
        {#if description}
          <Card.Description>{description}</Card.Description>
        {/if}
      </Column>
      {#if Boolean(download)}
        <Column>
          <DownloadTooltip {download} />
        </Column>
      {/if}
    </Row>
  </Card.Header>
{/if}
