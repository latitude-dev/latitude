import fs from 'fs'
import path from 'path'

import { StorageDriver } from '@/materialize/drivers/StorageDriver'
import { FullDriverConfig } from '@/materialize'

export default class DiskDriver extends StorageDriver {
  private materializeDir: string

  constructor({ path: materializeDir, manager }: FullDriverConfig<'disk'>) {
    super({ manager })
    this.materializeDir = materializeDir

    if (!fs.existsSync(this.materializeDir)) {
      fs.mkdirSync(this.materializeDir, { recursive: true })
    }
  }

  protected async resolveUrl(localFilepath: string): Promise<string> {
    const filepath = path.join(this.materializeDir, localFilepath)
    return filepath
  }

  protected async exists(localFilepath: string): Promise<boolean> {
    return fs.existsSync(await this.resolveUrl(localFilepath))
  }

  protected async parquetFileTime(localFilepath: string): Promise<number> {
    return fs.statSync(await this.resolveUrl(localFilepath)).mtimeMs
  }

  protected async parquetFileSize(localFilepath: string): Promise<number> {
    return fs.statSync(await this.resolveUrl(localFilepath)).size
  }
}
