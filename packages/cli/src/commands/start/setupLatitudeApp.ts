import degit from 'degit'
import path from 'path'
import colors from 'picocolors'
import fsExtra from 'fs-extra'
import { rimraf } from 'rimraf'

import fs from 'fs'
import util from 'util'

const rename = util.promisify(fs.rename)
const readdir = util.promisify(fs.readdir)

import { CommonProps } from './index.js'
import { LATITUDE_FOLDER } from '../constants.js'

export const REPO_FOLDER = 'apps/views-display'
export const APP_REPO_SLUG = `latitude-dev/latitude-sdk/${REPO_FOLDER}`
const CWD = process.cwd()

type Props = CommonProps & { destinationPath: string }
type TarProps = CommonProps & { latitudeFolder: string; appFolderTmp: string }

async function moveAppFromMonorepo({ latitudeFolder, appFolderTmp }: TarProps) {
  const appDir = `${latitudeFolder}/app`
  fsExtra.emptyDirSync(`${CWD}/${appDir}`)
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

export default async function setupLatitudeApp({
  onError,
  destinationPath,
}: Props) {
  // TODO: Mode: git is required to clone the repo while is private.
  // With 'mode: tar' is easier to download only the apps/views-display folder
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
