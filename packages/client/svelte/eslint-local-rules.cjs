const fs = require('fs')
const path = require('path')

module.exports = {
  'check-packagejson-exports': {
    meta: {
      type: 'error',
      docs: {
        description: "Check if package.json 'exports' field contains './dist'",
        category: 'Possible Errors',
        recommended: true,
      },
      fixable: null,
      schema: [],
    },
    create: function (context) {
      return {
        Program: (node) => {
          const filename = context.getFilename()

          // Only check package.json file
          if (!filename.endsWith('package.json')) {
            return
          }

          const packageJsonPath = path.join(context.getCwd(), 'package.json')

          if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(
              fs.readFileSync(packageJsonPath, 'utf8'),
            )

            if (!packageJson.exports) {
              context.report({
                node,
                message: "package.json 'exports' field is missing",
              })
              return
            }

            const packageJsonExports = JSON.stringify(packageJson.exports)

            if (packageJsonExports.includes('./dist')) {
              context.report({
                node,
                message: `
                💥 Oops! you build @latitude-data/svelte in your machine
                This has the side effect of modifying the package.json file
                why we modify package.json file at build time is explained here:
                ./packages/client/svelte/scripts/hack-svelte-package/README.md

                The fix is simple don't commit changes in 'main' branch
                with the word './dist' in package.json in 'exports' field
                for @latitude-data/svelte package

                Easy no? 😅
                `,
              })
            }
          }
        },
      }
    },
  },
}
