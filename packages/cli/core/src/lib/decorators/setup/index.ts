import setupApp from '$src/lib/setupApp'

export default function setup(commandFn: Function) {
  return async function (...args: any[]) {
    await setupApp()

    return commandFn(...args)
  }
}
