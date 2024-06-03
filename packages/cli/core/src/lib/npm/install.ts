import { Handlers } from '../spawn'
import npm from './_shared'

export default function npmInstall({
  cwd,
  handlers,
}: {
  cwd: string
  handlers: Handlers
}) {
  return npm({
    command: 'install',
    opts: {
      cwd,
      stdio: 'inherit',
    },
    handlers,
  })
}
