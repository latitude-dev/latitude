import { Config } from '@stencil/core'
import { reactOutputTarget } from '@stencil/react-output-target'

export const config: Config = {
  namespace: 'webcomponents',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    { type: 'docs-readme' },
    reactOutputTarget({
      componentCorePackage: '@latitude-data/webcomponents',
      proxiesFile: '../react/src/webcomponents/index.ts',
    }),
  ],
  testing: {
    browserHeadless: 'new',
  },
}
