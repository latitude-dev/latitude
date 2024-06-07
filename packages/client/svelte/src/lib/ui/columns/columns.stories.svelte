<script context="module" lang="ts">
  import Columns from './index.svelte'
  import { Column, Placeholder } from '$lib'
  import { type ColumnProps } from '@latitude-data/client'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import { spaces } from '@latitude-data/client'

  export const meta = {
    title: 'Columns',
    component: Columns,
    argTypes: {
      space: {
        options: spaces,
        control: { type: 'select' },
      },
    },
    args: {
      space: 'gutter',
    },
    parameters: {
      docs: {
        description: {
          component: 'Columns component',
        },
      },
    },
  }
  const width: ColumnProps['width'] = '6/12'
</script>

<Template let:args>
  <div class="lat-flex lat-flex-col lat-gap-y-6">
    <Columns {...args}>
      <Column width="content">
        <div class="lat-w-[631px]">
          <Placeholder label="Forced 631px in content" />
        </div>
      </Column>
      <Column>
        <Placeholder label="fluid" />
      </Column>
    </Columns>
    <!-- <Columns {...args}> -->
    <!--   <Column> -->
    <!--     <Placeholder label="fluid" /> -->
    <!--   </Column> -->
    <!--   <Column> -->
    <!--     <Placeholder label="fluid" /> -->
    <!--   </Column> -->
    <!-- </Columns> -->
    <!-- <Columns {...args}> -->
    <!--   <Column {width}> -->
    <!--     <Placeholder label={width} /> -->
    <!--   </Column> -->
    <!--   <Column {width}> -->
    <!--     <Placeholder label={width} /> -->
    <!--   </Column> -->
    <!-- </Columns> -->
    <!-- <Columns {...args}> -->
    <!--   <Column {width}> -->
    <!--     <Placeholder label={width} /> -->
    <!--   </Column> -->
    <!--   <Column> -->
    <!--     <Placeholder label="fluid" /> -->
    <!--   </Column> -->
    <!-- </Columns> -->
    <!-- <Columns {...args}> -->
    <!--   <Column width="content"> -->
    <!--     <div class="lat-w-[631px]"> -->
    <!--       <Placeholder label="Forced 631px in content" /> -->
    <!--     </div> -->
    <!--   </Column> -->
    <!--   <Column {width}> -->
    <!--     <Placeholder label={width} /> -->
    <!--   </Column> -->
    <!-- </Columns> -->
  </div>
</Template>

<Story name="Default" />
