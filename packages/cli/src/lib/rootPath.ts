import path from 'path'
import config from '../config'
import { DEV_SITES_ROUTE_PREFIX } from '../commands/constants'

// Returns the root path of your data app. This is used to prefix the routes in
// development whereas in production it will always be /.
export default function rootPath() {
  return config.pro
    ? ''
    : `/${DEV_SITES_ROUTE_PREFIX}/${path.basename(config.cwd)}`
}
