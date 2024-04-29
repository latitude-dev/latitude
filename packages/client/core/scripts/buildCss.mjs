import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

function twCli({ input, output, component = null }) {
  let cli = `npx tailwindcss -i ./src/theme/assets/${input}.css -o ./dist/css/${output}.css`
  cli = component
    ? `${cli} --content ./src/theme/ui/${component}/index.ts`
    : cli
  return execSync(cli, { stdio: 'inherit' })
}

const UI_ROOT = 'src/theme/ui'
const ui = fs.readdirSync(UI_ROOT).filter((file) => {
  const stat = fs.statSync(path.join(UI_ROOT, file))
  return stat.isDirectory()
})

// Build css/all.css
twCli({ input: 'latitude', output: 'all' })

// Build css for each component
ui.forEach((component) => {
  twCli({ input: 'component', output: `components/${component}`, component })
})
