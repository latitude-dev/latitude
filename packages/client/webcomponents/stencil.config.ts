import { Config } from '@stencil/core'
import { reactOutputTarget } from '@stencil/react-output-target'

export const config: Config = {
  namespace: 'webcomponents',
  outputTargets: [
    { type: 'docs-readme' },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'single-export-module',
      generateTypeDeclarations: true,
    },
    reactOutputTarget({
      componentCorePackage: '@latitude-data/webcomponents',
      proxiesFile: '../react/src/webcomponents/index.ts',
      customElementsDir: 'dist/components',
      includeImportCustomElements: true,
    }),
  ],
  testing: {
    browserHeadless: 'new',
  },
}
