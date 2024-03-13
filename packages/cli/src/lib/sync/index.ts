import syncQueries from './syncQueries'
import syncViews from './syncViews'

export default function sync(
  { watch = false }: { watch?: boolean } = { watch: false },
) {
  return Promise.all([syncViews({ watch }), syncQueries({ watch })])
}
