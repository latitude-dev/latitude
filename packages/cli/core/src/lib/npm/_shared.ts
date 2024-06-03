import betterSpawn, { Handlers } from '../spawn'

export default function npm({
  command,
  args = [],
  opts = { stdio: 'inherit' },
  handlers = {},
}: {
  command: string
  args?: string[]
  opts?: Record<string, any>
  handlers?: Handlers
}) {
  betterSpawn('npm', [command, ...args], opts, handlers)
}
