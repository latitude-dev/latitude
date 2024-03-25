import colors from 'picocolors'
import findConfigFile from './findConfigFile'
import fsExtra from 'fs-extra'
import path from 'path'
import { PartialLatitudeConfig } from '$src/config'

export default async function updateVersion({
  appDir,
  version,
}: {
  appDir: string
  version: string
}) {
  const data = findConfigFile({ appDir, throws: true })
  const config = data.data as PartialLatitudeConfig
  const current = config?.version

  if (current === version) return true

  const newConfig = { ...config, version }
  fsExtra.writeJsonSync(data.path, newConfig, { spaces: 2 })
  console.log(
    colors.green(
      `✅ ${path.basename(data.path)} updated version to ${version}`,
    ),
  )
}
