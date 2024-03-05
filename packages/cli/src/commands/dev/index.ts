import colors from 'picocolors'
import config from '../../config'
import path from 'path'
import watchQueries from './watchQueries'
import watchViews from './watchViews'
import { cwd } from 'process'
import { runDevServer } from './runDev'
import type { DevServerProps } from './runDev'

type Props = {
  devServer: DevServerProps
}
export default async function devCommand(props: Props) {
  const defaultDevServer = { open: config.pro }
  const devServer = props.devServer
    ? { ...props.devServer, ...defaultDevServer }
    : defaultDevServer
  console.log(colors.gray('Starting development server... \n'))

  await watchViews(path.join(cwd(), 'views'))
  await watchQueries(path.join(cwd(), 'queries'))
  runDevServer(devServer)
}
