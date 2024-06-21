import { FileStat, StorageType } from '$/types'
import { Writable } from 'stream'

export abstract class StorageDriver {
  constructor() {}

  public abstract type: StorageType

  get isS3Driver(): boolean {
    return this.type === StorageType.s3
  }

  abstract resolveUrl(path: string): Promise<string>

  abstract listFiles(path: string, recursive: boolean): Promise<string[]>

  abstract exists(path: string): Promise<boolean>
  abstract stat(path: string): Promise<FileStat>

  abstract write(path: string, data: Buffer | string): Promise<void>
  abstract read<T extends BufferEncoding | undefined>(
    path: string,
    encoding?: T,
  ): Promise<T extends undefined ? Buffer : string>

  abstract move(from: string, to: string): Promise<void>
  abstract delete(path: string): Promise<void>

  abstract createWriteStream(path: string): Promise<Writable>
}
