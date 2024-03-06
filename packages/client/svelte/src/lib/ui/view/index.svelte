<script context="module" lang="ts">
  export type Props = {
    class?: string
  }
</script>

<script lang="ts">
  import { Column } from '$lib'

  type $$Props = Props

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<Column class={className}>
  <slot />
</Column>
