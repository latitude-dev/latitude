import findOrCreateConfigFile from '../latitudeConfig/findOrCreate'
import installLatitudeServer from '../installLatitudeServer'
import installDependencies from '../installDependencies/fromSetup'
import { addDockerfiles } from '../addDockerfiles/fromSetup'
import addPackageJson from '../addPackageJson'

export type Props = { version?: string }

export default async function setupApp(
  { canary = false }: { canary?: boolean } = { canary: false },
) {
  const config = await findOrCreateConfigFile({ canary })
  await installLatitudeServer({ version: config.data.version })
  await installDependencies()
  addPackageJson()
  addDockerfiles()
}
