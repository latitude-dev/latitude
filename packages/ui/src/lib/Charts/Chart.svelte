<script lang="ts" context="module">
  import * as echarts from 'echarts';
  import defaultTheme from './defaultTheme';
  import type { ChartOptions, EChartsOptions } from './props.d.ts';
  import type { IQueryResult } from '$lib/latitude.ts';

  export type IOptions = {
    data: IQueryResult;
    title?: string;
    x: string;
    y: string;
    type: string;
  };

  export const buildOptions = ({ data, title, x, y, type }: IOptions) => {
    const xAxisData = data.rows.map((r) => r[x]);
    const yAxisData = data.rows.map((r) => r[y]);

    const options = {
      title: {
        text: title,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      } as echarts.XAXisComponentOption,
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: yAxisData,
          type,
        },
      ] as echarts.SeriesOption[],
    } as EChartsOptions;

    return options;
  };

  const DEFAULT_OPTIONS: Partial<ChartOptions> = {
    theme: defaultTheme,
    ssr: false,
    renderer: 'canvas',
  };

  export function chartable(element: HTMLElement, echartOptions: ChartOptions) {
    const echartsInstance = echarts.init(element, echartOptions.theme, { renderer: 'canvas' });
    echartsInstance.setOption(echartOptions.options);

    function handleResize() {
      echartsInstance.resize();
    }

    window.addEventListener('resize', handleResize);

    return {
      destroy() {
        echartsInstance.dispose();
        window.removeEventListener('resize', handleResize);
      },

      update(newOptions: ChartOptions) {
        echartsInstance.setOption({
          ...echartOptions.options,
          ...newOptions.options,
        });
      },
    };
  }
</script>

<script lang="ts">
  export let options: echarts.EChartsOption | undefined;
  export let { theme } = DEFAULT_OPTIONS;

  let chart: string;

  const echartsInstance = echarts.init(null, theme, {
    renderer: 'svg',
    ssr: true,
    width: 400,
    height: 300,
  });

  if (options) echartsInstance.setOption(options);

  chart = echartsInstance.renderToSVGString();
</script>

{@html chart}
