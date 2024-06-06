<script context="module" lang="ts">
  export type Props = {
    height?: string
    width?: string
    shape?: 'round' | 'rectangle'
    class?: string
    label?: string
  }
</script>

<script lang="ts">
  import Box from '$lib/ui/box'
  import Text from '$lib/ui/text'

  type $$Props = Props

  export let shape: $$Props['shape'] = 'rectangle'
  export let width: $$Props['width'] = 'auto'
  export let height: $$Props['height'] = '120px'
  let className: $$Props['class'] = undefined
  export let label: $$Props['label'] = undefined
  export { className as class }
</script>

<Box
  overflow="hidden"
  alignY="center"
  alignX="center"
  padding="gutter"
  position="relative"
  backgroundColor="muted"
  borderRadius={shape === 'round' ? 'full' : undefined}
  class={`lat-border lat-border-gray-100 lat-bg-gray-50 lat-text-gray-400 ${className}`}
  style={`width: ${width}; height: ${height}`}
>
  <svg
    class="lat-absolute lat-inset-0 lat-h-full lat-w-full lat-bg-gray-50"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <line
      class="lat-stroke-gray-200 lat-stroke-1"
      x1={0}
      y1={0}
      x2="100"
      y2="100"
    ></line>
    <line
      class="lat-stroke-gray-200 lat-stroke-1"
      x1="100"
      y1={0}
      x2={0}
      y2="100"
    ></line>
  </svg>
  {#if label}
    <Box
      padding="small"
      borderRadius="full"
      position="relative"
      class="bg-red-500"
    >
      <Text.H5M color="inherit">{label}</Text.H5M>
    </Box>
  {/if}
</Box>
