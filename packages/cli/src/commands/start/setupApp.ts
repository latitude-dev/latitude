import config from '../../config'
import cloneAppFromGit from './cloneAppFromGit'
import { CommonProps } from './index'
import synlinkAppFromLocal from './synlinkAppFromLocal'

export type Props = CommonProps & { destinationPath: string }

export default async function setupApp(props: Props) {
  const setup = config.pro ? cloneAppFromGit : synlinkAppFromLocal
  return setup(props)
}
