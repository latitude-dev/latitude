import path from 'path'
import config from '../../config'
import { OnErrorFn } from '../../types'
import cloneAppFromNpm from './cloneAppFromNpm'
import synlinkAppFromLocal from './synlinkAppFromLocal'
import installAppDependencies from './installDependencies'

export type Props = {
  onError: OnErrorFn
  destinationPath: string
  appVersion?: string
}

export default async function setupApp(props: Props) {
  let allGood = false

  const isPro = config.pro || config.simulatedPro
  const dataAppDir = props.destinationPath
  const setup = isPro ? cloneAppFromNpm : synlinkAppFromLocal
  await setup(props)

  process.chdir(path.resolve(dataAppDir))

  if (!isPro) {
    allGood = true
    return allGood
  }

  try {
    await installAppDependencies({
      dataAppDir: props.destinationPath,
      appVersion: props.appVersion,
    })
    allGood = true
  } catch {
    // Ignore is handled by the installAppDependencies
  }

  return allGood
}
