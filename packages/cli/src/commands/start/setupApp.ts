import config from '../../config'
import cloneAppFromNpm from './cloneAppFromNpm'
import { CommonProps } from './index'
import synlinkAppFromLocal from './synlinkAppFromLocal'

export type Props = CommonProps & {
  destinationPath: string
  appVersion?: string
}

export default async function setupApp(props: Props) {
  const isPro = config.pro || config.simulatedPro
  const setup = isPro ? cloneAppFromNpm : synlinkAppFromLocal
  return setup(props)
}
