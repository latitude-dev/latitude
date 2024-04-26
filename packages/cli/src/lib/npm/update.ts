import { Handlers } from '../spawn'
import npm from './_shared'

export default function npmUpdate({
  cwd,
  handlers,
}: {
  cwd: string
  handlers: Handlers
}) {
  npm({
    command: 'update',
    opts: {
      cwd,
      stdio: 'inherit',
    },
    handlers,
  })
}
