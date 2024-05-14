import { ConnectorType } from '@/baseConnector/connectorFactory'
import SourceManager from '@/manager'
import { Source } from '@/source'
import { resolve, join } from 'path'
export const ROOT_DIR = resolve(__dirname, '../../src/tests/dummyApp')
export const QUERIES_DIR = join(ROOT_DIR, 'queries')

export function createDummySource() {
  const sourceManager = new SourceManager('queryDirPath')

  return new Source({
    path: 'path',
    schema: { type: ConnectorType.Mssql },
    sourceManager,
  })
}
