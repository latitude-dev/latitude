import type { Preview } from '@storybook/svelte'
import { ThemeProvider } from '../src/lib'

import '@latitude-sdk/client/latitude.css'

/** @type { import('@storybook/svelte').Preview } */
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    () => ({
      Component: ThemeProvider,
      props: {
        isStorybook: true,
      },
    }),
  ],
}

export default preview
