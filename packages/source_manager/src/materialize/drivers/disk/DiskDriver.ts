import fs from 'fs'
import path from 'path'

import {
  MaterializedFileNotFoundError,
  ResolveUrlParams,
  StorageDriver,
} from '@/materialize/drivers/StorageDriver'

export default class DiskDriver extends StorageDriver {
  private path: string

  constructor({ path }: { path: string }) {
    super()
    this.path = path
  }

  resolveUrl({ queryName, filename }: ResolveUrlParams): Promise<string> {
    const filepath = path.join(this.path, filename)

    if (fs.existsSync(filepath)) return Promise.resolve(filepath)

    return Promise.reject(
      new MaterializedFileNotFoundError(
        `materialize query not found for: ${queryName}`,
      ),
    )
  }
}
