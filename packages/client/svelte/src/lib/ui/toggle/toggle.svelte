<script context="module" lang="ts">
  export type Props = Omit<TogglePrimitive.Props, 'class'> & {
    variant?: theme.ui.toggle.Variant
    size?: theme.ui.toggle.Size
    class?: string | null | undefined
  }
</script>

<script lang="ts">
	import { Toggle as TogglePrimitive } from "bits-ui";
  import { theme } from '@latitude-data/client'

	type $$Props = Props

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let pressed: $$Props["pressed"] = undefined;
	export { className as class };
</script>

<TogglePrimitive.Root
	bind:pressed
	class={theme.ui.toggle.cssClass({ variant, size, className })}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</TogglePrimitive.Root>
