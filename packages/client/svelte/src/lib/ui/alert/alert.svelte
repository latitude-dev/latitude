<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { AlertFontWeight } from './text.svelte'

  export type Props = HTMLAttributes<HTMLDivElement> &
    theme.ui.alert.Props & {
      html?: boolean
      centerText?: boolean
      fontWeight?: AlertFontWeight
    }
</script>

<script lang="ts">
  import { theme } from '@latitude-data/client'
  import AlertText from './text.svelte'

  type $$Props = Props

  let className: $$Props['class'] = undefined
  export let type: $$Props['type']
  export let scrollable: $$Props['scrollable'] = false
  export let centerText: $$Props['centerText'] = true
  export let fontWeight: $$Props['fontWeight'] = 'normal'
  export let html: $$Props['html'] = false
  export let secondary: $$Props['secondary'] = false
  export { className as class }

  $: styles = theme.ui.alert.cssClass({
    type,
    scrollable,
    secondary,
    className,
  })
  $: textColor = styles.properties.foreground
</script>

<div class={styles.root} {...$$restProps} role="alert">
  {#if html}
    <slot />
  {:else}
    <AlertText color={textColor} {fontWeight} centered={centerText}>
      <slot />
    </AlertText>
  {/if}
</div>
