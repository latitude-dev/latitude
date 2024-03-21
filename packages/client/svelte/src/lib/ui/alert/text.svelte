<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type {
    FontWeight,
    TextColor,
    ExtendsUnion,
  } from '@latitude-data/client'

  export type AlertFontWeight = ExtendsUnion<
    FontWeight,
    'normal' | 'medium' | 'bold'
  >
  export type Props = HTMLAttributes<HTMLDivElement> & {
    fontWeight?: AlertFontWeight
    color: TextColor
    centered?: boolean
  }
</script>

<script lang="ts">
  import Text from '../text'
  type $$Props = Props

  export let fontWeight: $$Props['fontWeight'] = 'normal'
  export let centered: $$Props['centered'] = true
  export let color: $$Props['color']
</script>

{#if fontWeight === 'normal'}
  <Text.H5 {color} {centered}><slot /></Text.H5>
{:else if fontWeight === 'medium'}
  <Text.H5M {color} {centered}><slot /></Text.H5M>
{:else if fontWeight === 'bold'}
  <Text.H5B {color} {centered}><slot /></Text.H5B>
{/if}
