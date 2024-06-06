<script context="module" lang="ts">
  import { type ColumnProps } from '@latitude-data/client'
  export type Props = Omit<ColumnProps, 'className'> & {
    class?: string
  }
</script>

<script lang="ts">
  import { theme } from '@latitude-data/client'

  type $$Props = Props

  export let width: $$Props['width'] = undefined
  let className: $$Props['class'] = undefined
  export { className as class }

  $: classes = theme.ui.column.cssClass({ className, width })
</script>

<div class={classes}>
  <slot />
</div>
