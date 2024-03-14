import maybeSetupApp from '$src/lib/maybeSetupApp'

export default function setup(commandFn: Function) {
  return async function (...args: any[]) {
    const ready = await maybeSetupApp()
    if (!ready) process.exit(1)

    return commandFn(...args)
  }
}
