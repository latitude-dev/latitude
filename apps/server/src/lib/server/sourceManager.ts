import { SourceManager } from '@latitude-data/source-manager'

export const QUERIES_DIR = 'static/.latitude/queries'
const sourceManager = new SourceManager(QUERIES_DIR)

export default sourceManager
