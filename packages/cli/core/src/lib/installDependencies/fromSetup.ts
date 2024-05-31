import { manageDependencies } from './_shared'

export default async function installDependencies() {
  await Promise.all([
    manageDependencies({ root: true }),
    manageDependencies({ root: false }),
  ])
}
