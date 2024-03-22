import fsExtra from 'fs-extra'
import path from 'path'
import colors from 'picocolors'
import { PartialLatitudeConfig } from '$src/config'
import { findConfigFile } from './findOrCreate'
import { onError } from '$src/utils'

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

  if (current === version) return

  const newConfig = { ...config, version }

  try {
    fsExtra.writeJsonSync(data.path, newConfig, { spaces: 2 })

    console.log(
      colors.green(
        `✅ ${path.basename(data.path)} updated version to ${version}`,
      ),
    )
  } catch (_e) {
    onError({
      error: _e as Error,
      message: '🚨 Failed to update version in latitude.json',
    })

    process.exit(1)
  }
}
