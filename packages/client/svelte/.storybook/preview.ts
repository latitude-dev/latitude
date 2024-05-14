import type { Preview } from '@storybook/svelte'
import { ThemeWrapper } from '../src/lib/storybook'

import '@latitude-data/client/latitude.css'

/** @type { import('@storybook/svelte').Preview } */
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    deepControls: { enabled: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    () => ({
      Component: ThemeWrapper,
    }),
  ],
}

export default preview
