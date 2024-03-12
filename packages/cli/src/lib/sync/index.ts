import syncDotenv from './syncDotenv'
import syncQueries from './syncQueries'
import syncViews from './syncViews'

export default function sync(
  { watch = false }: { watch?: boolean } = { watch: false },
) {
  return Promise.all([
    syncDotenv({ watch }),
    syncViews({ watch }),
    syncQueries({ watch }),
  ])
}
