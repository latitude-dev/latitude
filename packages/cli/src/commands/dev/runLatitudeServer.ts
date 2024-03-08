import config from '../../config'
import path from 'path'
import syncQueries from '../shared/syncQueries'
import syncViews from '../shared/syncViews'
import { APP_FOLDER, DEV_SITES_ROUTE_PREFIX } from '../constants'
import { runDevServer } from './runDev'

import type { DevServerProps } from './runDev'

type Props = {
  server: DevServerProps
  dataAppDir?: string
}

export default async function runLatitudeServer(props: Props) {
  const cwd = config.cwd
  const appName = path.basename(cwd)

  await syncViews({ dataAppDir: cwd, appName, watch: true })
  await syncQueries({ rootDir: cwd, watch: true })

  runDevServer({
    ...props.server,
    open: props.server?.open ?? true,
    appFolder: `${cwd}/${APP_FOLDER}`,
    routePath: config.pro ? null : `/${DEV_SITES_ROUTE_PREFIX}/${appName}`,
  })
}
