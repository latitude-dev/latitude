import { QUERIES_DIR } from '../constants'
import { SourceManager } from '@latitude-data/source-manager'
import storageDriver from './storageDriver'

const sourceManager = new SourceManager(QUERIES_DIR, { storage: storageDriver })
export default sourceManager
