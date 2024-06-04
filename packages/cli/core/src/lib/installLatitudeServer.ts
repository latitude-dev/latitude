import config from '$src/config'
import cloneAppFromNpm from './setupApp/cloneAppFromNpm'
import symlinkAppFromLocal from './setupApp/symlinkAppFromLocal'

export default async function installLatitudeServer({
  version,
}: {
  version?: string
}): Promise<boolean | void> {
  return config.prod
    ? await cloneAppFromNpm({ version })
    : await symlinkAppFromLocal()
}
