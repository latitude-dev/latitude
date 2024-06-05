<script context="module" lang="ts">
  export type Props = {
    height?: string | number
    width?: string | number
    shape?: 'round' | 'rectangle'
    class?: string
    label?: string
  }
</script>

<script lang="ts">
  import Box from '$lib/ui/box'
  import Text from '$lib/ui/text'

  const resolveToPxIfUnitless = (value: string | number) =>
    typeof value === 'string' && /[0-9]$/.test(value) ? `${value}px` : value

  type $$Props = Props

  export let shape: $$Props['shape'] = 'rectangle'
  export let width: $$Props['width'] = 'auto'
  export let height: $$Props['height'] = 120
  let className: $$Props['class'] = undefined
  export let label: $$Props['label'] = undefined
  export { className as class }
  let lineClass = 'lat-stroke-2 stroke-[hsla(0_0%_20%_0.1)]'
</script>

<Box
  display="inline"
  overflow="hidden"
  alignY="center"
  alignX="center"
  borderRadius={shape === 'round' ? 'full' : undefined}
  class={className}
  style={{
    width: resolveToPxIfUnitless(width),
    height: resolveToPxIfUnitless(height),
  }}
>
  {#if label}
    <Text.H5 color="foreground">{label}</Text.H5>
  {:else}
    <svg
      class="lat-absolute lat-h-full lat-w-full"
      <line class={lineClass} x1={0} y1={0} x2="100%" y2="100%"></line>
      <line class={lineClass} x1="100%" y1={0} x2={0} y2="100%"></line>
    </svg>
  {/if}
</Box>
