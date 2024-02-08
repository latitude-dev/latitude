	import * as echarts from 'echarts';

	export type EChartsOptions = echarts.EChartsOption;
	export type EChartsRenderer = 'canvas' | 'svg';
	export type EChartsTheme = string | object;
	export type ChartOptions = {
		theme?: EChartsTheme;
		options: EChartsOptions;
		renderer?: EChartsRenderer;
		ssr?: boolean;
	};

