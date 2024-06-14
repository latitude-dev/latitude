import SourceManager from '@/manager'
import { StorageDriver } from '@/materialize/drivers/StorageDriver'

export default class DummyDriver extends StorageDriver {
  constructor({ manager }: { manager: SourceManager }) {
    super({ manager })
  }

  protected async resolveUrl(localFilepath: string): Promise<string> {
    return localFilepath
  }

  protected async exists(): Promise<boolean> {
    return false
  }

  protected async parquetFileTime(): Promise<number> {
    return Date.now()
  }

  protected async parquetFileSize(): Promise<number> {
    return 0
  }
}
