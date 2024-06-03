const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-links',
    '@storybook/addon-themes',
    '@storybook/addon-essentials',
    'storybook-addon-deep-controls',
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {},
  },
  docs: {
    defaultName: 'Documentation'
  },
}

export default config
