import fsExtra from 'fs-extra'
import path from 'path'
import colors from 'picocolors'
import { PartialLatitudeConfig } from '../../config'
import { findConfigFile } from './findOrCreate'

export default async function updateVersion({
  appDir,
  appVersion,
}: {
  appDir: string
  appVersion: string
}) {
  const data = findConfigFile(appDir)
  const config = data.data as PartialLatitudeConfig
  const current = config?.appVersion

  if (current === appVersion) return true

  const newConfig = { ...config, appVersion }
  fsExtra.writeJsonSync(data.path, newConfig, { spaces: 2 })
  console.log(
    colors.green(
      `✅ ${path.basename(data.path)} updated version to ${appVersion}`,
    ),
  )
}
