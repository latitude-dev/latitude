import { ConnectorType } from '@/types'
import SourceManager from '@/manager'
import { Source } from '@/source'
import { resolve, join } from 'path'
export const ROOT_DIR = resolve(__dirname, '../../src/tests/dummyApp')
export const QUERIES_DIR = join(ROOT_DIR, 'queries')

export async function getSource(queryPath: string, queriesDir = QUERIES_DIR) {
  const sourceManager = new SourceManager(queriesDir)
  return sourceManager.loadFromQuery(queryPath)
}

export function createDummySource() {
  const sourceManager = new SourceManager('queryDirPath')

  return new Source({
    path: 'path',
    schema: { type: ConnectorType.Mssql },
    sourceManager,
  })
}
