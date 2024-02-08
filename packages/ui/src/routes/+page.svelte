<script lang="ts">
	import Column from '$lib/Column.svelte';
	import Row from '$lib/Row.svelte';
	import H1 from '$lib/Text/H1.svelte';
	import H2 from '$lib/Text/H2.svelte';
	import H3 from '$lib/Text/H3.svelte';
	import H4 from '$lib/Text/H4.svelte';

	import '../index.css';
</script>

<Column gap={4}>
	<Row>
		<H1>This is an H1</H1>
	</Row>
	<Row>
		<H2 color="gray600">This is a gray H2</H2>
	</Row>
	<Row>
		<H3 weight="bold">This is a bold H3</H3>
	</Row>
	<Row>
		<H4 underline>This is an underlined H4</H4>
	</Row>
	<Row gap={4}>
		<Column>
			<H2>This is a column</H2>
		</Column>
		<Column>
			<H2>This is another column</H2>
		</Column>
		<Column>
			<H2>This is yet another column</H2>
		</Column>
	</Row>
</Column>
