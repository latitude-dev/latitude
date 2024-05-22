import fs from 'fs'
import path from 'path'

import {
  MaterializedFileNotFoundError,
  ResolveUrlParams,
  StorageDriver,
} from '@/materialize/drivers/StorageDriver'
import { FullDriverConfig } from '@/materialize'

export default class DiskDriver extends StorageDriver {
  private materializeDir: string

  constructor({ path, manager }: FullDriverConfig<'disk'>) {
    super({ manager })

    this.materializeDir = path
  }

  get basePath(): string {
    return this.materializeDir
  }

  resolveUrl({
    queryName,
    filename,
    ignoreMissingFile = false,
  }: ResolveUrlParams): Promise<string> {
    const filepath = path.join(this.materializeDir, filename)

    if (ignoreMissingFile) return Promise.resolve(filepath)

    if (fs.existsSync(filepath)) return Promise.resolve(filepath)

    return Promise.reject(
      new MaterializedFileNotFoundError(
        `materialize query not found for: '${queryName}'`,
      ),
    )
  }
}
