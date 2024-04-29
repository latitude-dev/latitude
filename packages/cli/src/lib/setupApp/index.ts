import findOrCreateConfigFile from '../latitudeConfig/findOrCreate'
import installLatitudeServer from '../installLatitudeServer'
import installDependencies from '../installDependencies/fromSetup'
import { addDockerfiles } from '../addDockerfiles/fromSetup'
import addPackageJson from '../addPackageJson'

export type Props = { version?: string }

export default async function setupApp(
  { next = false }: { next?: boolean } = { next: false },
) {
  const config = await findOrCreateConfigFile({ next })
  await installLatitudeServer({ version: config.data.version })
  await installDependencies()
  addPackageJson()
  addDockerfiles()
}
