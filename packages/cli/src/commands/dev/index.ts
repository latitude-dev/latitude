import colors from 'picocolors'
import { getLatitudeBanner } from '../../utils'
import { runDevServer } from './runDev'

export default async function devCommand() {
  const banner = await getLatitudeBanner()
  console.log(colors.green(banner))
  runDevServer({ open: true })
}
