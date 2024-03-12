<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
	import { setToggleGroupCtx } from "./index.js";
  import { theme } from '@latitude-data/client'

	type $$Props = ToggleGroupPrimitive.Props<"single" | "multiple"> & theme.ui.toggle.VariantProps;

	let className: string | undefined | null = undefined;
	export { className as class };
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let value: $$Props["value"] = undefined;

	setToggleGroupCtx({
		variant,
		size,
	});
</script>

<ToggleGroupPrimitive.Root
	class={theme.ui.toggleGroup.cssClass({ className })}
	bind:value
	{...$$restProps}
	let:builder
>
	<slot {builder} />
</ToggleGroupPrimitive.Root>
