import { manageDependencies } from './_shared'

export default async function installDependencies() {
  await Promise.all([
    manageDependencies({ root: true, isUpdate: true }),
    manageDependencies({ root: false, isUpdate: true }),
  ])
}
