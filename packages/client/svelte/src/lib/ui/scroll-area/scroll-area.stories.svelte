<script context="module" lang="ts">
  import ScrollArea from '.';
  import { Story, Template } from '@storybook/addon-svelte-csf';

  export const meta = {
    title: 'ScrollArea',
    component: ScrollArea,
    argTypes: {
      orientation: {
        options: ['both', 'vertical', 'horizontal'],
        control: { type: 'radio' },
      },
      scrollbarXClasses: {
        control: { type: 'text' },
      },
      scrollbarYClasses: {
        control: { type: 'text' },
      },
      class: {
        control: { type: 'text' },
      },
    },
    parameters: {
      layout: 'fullscreen',
      docs: {
        description: {
          component: 'A component that provides a scrollable area with custom scrollbars.',
        },
      },
    },
  }
</script>

<Template let:args>
  <div class="lat-h-full lat-w-full lat-flex lat-items-center lat-justify-center">
    <ScrollArea {...args}>
      <div class="lat-h-[500px] lat-w-[500px]" style="background: linear-gradient(to bottom right, blue, red);">
        <div class="p-2 lat-text-white">Scroll me</div>
      </div>
    </ScrollArea>
  </div>
</Template>

<Story name="Default" args={{
  orientation: 'both',
  scrollbarXClasses: "",
  scrollbarYClasses: "",
  class: "lat-h-[200px] lat-w-[200px] lat-rounded-lg",
}}>
</Story>
