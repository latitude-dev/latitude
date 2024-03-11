import syncQueries from '../shared/syncQueries'
import syncViews from '../shared/syncViews'

export default function prepareCommand() {
  return Promise.all([syncViews(), syncQueries()])
}
