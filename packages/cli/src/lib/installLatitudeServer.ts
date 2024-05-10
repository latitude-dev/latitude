import config from '$src/config'
import cloneAppFromNpm from './setupApp/cloneAppFromNpm'
import symlinkAppFromLocal from './setupApp/symlinkAppFromLocal'

export default function installLatitudeServer({
  version,
}: {
  version?: string
}) {
  return config.prod ? cloneAppFromNpm({ version }) : symlinkAppFromLocal()
}
