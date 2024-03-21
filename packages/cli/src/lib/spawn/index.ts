import { SpawnOptions, spawn } from 'child_process'

type Handlers = {
  onClose?: (...args: any[]) => void
  onError?: (...args: any[]) => void
  onStdout?: (...args: any[]) => void
  onStderr?: (...args: any[]) => void
}

export default function betterSpawn(
  command: string,
  args: string[],
  options: SpawnOptions = {},
  handlers: Handlers = {},
) {
  const process = spawn(command, args, options)

  if (handlers.onStdout) {
    process.stdout?.on('data', handlers.onStdout)
  }

  if (handlers.onStderr) {
    process.stderr?.on('data', handlers.onStderr)
  }

  if (handlers.onError) {
    process.on('error', handlers.onError)
  }

  if (handlers.onClose) {
    process.on('close', handlers.onClose)
  }

  return process
}
