import { FileStat } from '$/types'
import { Writable } from 'stream'

export abstract class StorageDriver {
  constructor() {}

  abstract resolveUrl(path: string): Promise<string>

  abstract listFiles(path: string, recursive: boolean): Promise<string[]>

  abstract exists(path: string): Promise<boolean>
  abstract stat(path: string): Promise<FileStat>

  abstract write(path: string, data: Buffer | string): Promise<void>
  abstract read<T extends BufferEncoding | undefined>(
    path: string,
    encoding?: T,
  ): Promise<T extends undefined ? Buffer : string>

  abstract createWriteStream(path: string): Promise<Writable>
}
