import { Config } from '@stencil/core'
import { reactOutputTarget } from '@stencil/react-output-target'

// NOTE: `externalRuntime: false` why?
// Docs: https://stenciljs.com/docs/custom-elements#externalruntime
// This compile in this package `@stencil/core`. Other option would be
// to do it in `@latitude-data/react` by requiring as dependency `@stencil/core`
// But for now because we only have one component I think is fine to ship it here.
// so it has the runtime
export const config: Config = {
  namespace: 'webcomponents',
  outputTargets: [
    { type: 'docs-readme' },
    { type: 'dist' },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'single-export-module',
      generateTypeDeclarations: true,
      externalRuntime: false,
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
