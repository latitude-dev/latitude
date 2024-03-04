<script lang="ts">
  type Props = {
    height?: number
    width?: 'auto' | number
    label?: string
  }
  export let label: Props['label']
  export let width: Props['width'] = 'auto'
  export let height: Props['height'] = 120
</script>

<div
  class="border-[hsla(0, 0%, 20%, 0.4)] text-[hsla(0, 0%, 20%, 0.7)] bg-[hsla(0, 0%, 20%, 0.04)] relative flex items-center justify-center border-2 p-2"
  style={`width: ${
    width === 'auto' ? 'auto' : `${width}px`
  }; height: ${height}px;`}
>
  {#if label}
    label
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" class="absolute h-full w-full">
      <line
        class="stroke-[hsla(0, 0%, 20%, 0.15)] stroke-[2px]"
        x1={0}
        y1={0}
        x2="100%"
        y2="100%"
      />
      <line
        class="stroke-[hsla(0, 0%, 20%, 0.15)] stroke-[2px]"
        x1="100%"
        y1={0}
        x2={0}
        y2="100%"
      />
    </svg>
  {/if}
</div>
