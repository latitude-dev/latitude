<script context="module" lang="ts">
  import type { Dataset, QueryResultState } from '@latitude-data/client'

  export type WrapperProps = QueryResultState & {
    bordered?: boolean
    title?: string
    description?: string
    height?: number
    width?: number
    download?: () => Promise<void>
  }
</script>

<script lang="ts">
  import * as Card from '$lib/ui/card'
  import VisualizationHeader from '../_shared/VisualizationHeader.svelte'
  import BlankSlate from './_BlankSlate.svelte'
  import Error from './_Error.svelte'
  import { theme as client } from '@latitude-data/client'

  const { cn } = client.utils

  type $$Props = WrapperProps

  export let data: $$Props['data'] = null
  export let isLoading: $$Props['isLoading'] = false
  export let height: $$Props['height'] = undefined
  export let width: $$Props['width'] = undefined
  export let title: $$Props['title'] = undefined
  export let description: $$Props['description'] = undefined
  export let error: $$Props['error'] = null
  export let bordered: $$Props['bordered'] = false
  export let download: $$Props['download'] = undefined

  const cardStyle = bordered ? 'normal' : 'invisible'

  function getPadding(element: HTMLDivElement, side: 'top' | 'bottom') {
    const cs = getComputedStyle(element)
    const padding = side === 'top' ? cs?.paddingTop : cs?.paddingBottom
    return parseFloat(padding)
  }

  function calculateHeight(element: HTMLDivElement) {
    return (
      element.clientHeight +
      getPadding(element, 'top') +
      getPadding(element, 'bottom')
    )
  }

  $: dataset = {
    fields: data?.fields ? data.fields.map((f) => f.name) : [],
    source: data?.rows ?? [],
  } as Dataset

  let headerHeight = 0
  $: contentPaddingTop = 0
  $: contentPaddingBottom = 0

  function cardHeaderDimensions(element: HTMLDivElement) {
    headerHeight = calculateHeight(element)
    const resizeObserver = new ResizeObserver(() => {
      headerHeight = calculateHeight(element)
    })
    return {
      destroy() {
        resizeObserver.unobserve(element)
      },
    }
  }
  function cardContentDimensions(element: HTMLDivElement) {
    contentPaddingTop = getPadding(element, 'top')
    contentPaddingBottom = getPadding(element, 'bottom')
    const resizeObserver = new ResizeObserver(() => {
      contentPaddingTop = getPadding(element, 'top')
      contentPaddingBottom = getPadding(element, 'bottom')
    })
    return {
      destroy() {
        resizeObserver.unobserve(element)
      },
    }
  }

  $: contentHeight = height
  $: {
    if (title) {
      contentHeight = height
        ? height + contentPaddingTop + contentPaddingBottom - headerHeight
        : height
    } else {
      contentHeight = height
        ? height - contentPaddingTop - contentPaddingBottom - headerHeight
        : height
    }
  }
</script>

<div
  class={cn('relative lat-h-full lat-w-full', { 'animate-pulse': isLoading })}
  style="width: {width}px; height: {height}px"
>
  <Card.Root class="lat-h-full" type={cardStyle}>
    <VisualizationHeader
      {title}
      {description}
      {download}
      headerType={cardStyle}
      headerAction={cardHeaderDimensions}
    />

    <Card.Content
      type={cardStyle}
      action={cardContentDimensions}
      style="height: {contentHeight}px;"
    >
      {#if error}
        <Error {error} />
      {:else if !data || (!data && isLoading)}
        <BlankSlate {isLoading} />
      {:else}
        <slot {dataset} {contentHeight} />
      {/if}
    </Card.Content>
  </Card.Root>
</div>
