import degit from 'degit'
import path from 'path'
import colors from 'picocolors'
import fsExtra from 'fs-extra'
import { rimraf } from 'rimraf'
import fs from 'fs'
import util from 'util'
const rename = util.promisify(fs.rename)
const readdir = util.promisify(fs.readdir)

import { LATITUDE_FOLDER, REPO_FOLDER } from '../constants'
import { CommonProps } from './index'
import { Props } from './setupApp'

export const APP_REPO_SLUG = `latitude-dev/latitude-sdk/${REPO_FOLDER}`

type RepoProps = CommonProps & { latitudeFolder: string; appFolderTmp: string }
async function moveAppFromMonorepo({
  latitudeFolder,
  appFolderTmp,
}: RepoProps) {
  const appDir = `${latitudeFolder}/app`
  fsExtra.emptyDirSync(`${process.cwd()}/${appDir}`)
  const tmpDir = `${latitudeFolder}/${appFolderTmp}`
  const repoDir = path.join(tmpDir, REPO_FOLDER)
  const files = await readdir(repoDir)

  for (const file of files) {
    const src = path.join(repoDir, file)
    const dest = path.join(appDir, file)
    await rename(src, dest)
  }

  await rimraf(tmpDir)
}

/**
 * FIXME: THIS IS NOT WORKING
 * =========================================================
 * We need to copy the apps/server folder but replace
 * somehow the dependencies from the monorepo to the new app
 * because for example:
 *
 *    "@latitude-sdk/connector": "workspace:*"
 *
 * Is not valid outside the monorepo.
 */
export default async function cloneAppFromGit({
  onError,
  destinationPath,
}: Props) {
  // TODO: Mode: git is required to clone the repo while is private.
  // With 'mode: tar' is easier to download only the apps/server folder
  // Remove this when we're Open Source
  const latitudeFolder = `${destinationPath}/${LATITUDE_FOLDER}`
  const appTemplate = degit(APP_REPO_SLUG, { force: true, mode: 'git' })

  console.log(colors.yellow('🚀 Downloading Latitude App...'))

  appTemplate.clone(`${latitudeFolder}/appTmp`).catch((err) => {
    onError({ error: err, message: `💥 Error downloading app` })
  })

  return new Promise<void>((resolve) => {
    appTemplate.on('info', async () => {
      // TODO: Remove this when we're Open Source
      await moveAppFromMonorepo({
        onError,
        latitudeFolder,
        appFolderTmp: 'appTmp',
      })

      resolve()
      console.log(colors.green('✅ Latitup app downloaded'))
    })
  })
}
