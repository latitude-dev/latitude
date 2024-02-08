<script lang="ts">
	import Text from './Text.svelte';
	import type { Props } from './props.ts';

	export let restProps = $$restProps as Omit<Props, 'size'>;
</script>

<!-- @ts-ignore -->
<Text size="h3" {...restProps}>
	<slot />
</Text>
