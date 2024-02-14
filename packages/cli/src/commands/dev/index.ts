import colors from 'picocolors'
import path from 'path'
import watchQueries from './watchQueries'
import { cwd } from 'process'
import { getLatitudeBanner } from '../../utils'
import { runDevServer } from './runDev'
import config from '../../config'

export default async function devCommand() {
  const banner = await getLatitudeBanner()
  console.log(colors.green(banner))
  watchQueries(path.join(cwd(), 'queries'))
  runDevServer({ open: config.pro })
}
