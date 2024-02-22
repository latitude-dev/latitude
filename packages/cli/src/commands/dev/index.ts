import colors from 'picocolors'
import config from '../../config'
import path from 'path'
import watchQueries from './watchQueries'
import watchViews from './watchViews'
import { cwd } from 'process'
import { runDevServer } from './runDev'

export default async function devCommand() {
  console.log(colors.gray('Starting development server... \n'))

  await watchViews(path.join(cwd(), 'views'))
  await watchQueries(path.join(cwd(), 'queries'))
  runDevServer({ open: config.pro })
}
