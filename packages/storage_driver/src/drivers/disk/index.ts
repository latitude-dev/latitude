import { FileStat } from '$/types'
import { StorageDriver } from '$/drivers/base'
import fs from 'fs'
import path from 'path'
import { Writable } from 'stream'

export type DiskDriverConfig = {
  path: string
}

export class DiskDriver extends StorageDriver {
  private root: string

  constructor(config: DiskDriverConfig) {
    super()
    this.root = config.path ?? ''
  }

  private async createDirIfNotExists(filepath: string): Promise<void> {
    if (!fs.existsSync(await this.resolveUrl(path.dirname(filepath)))) {
      fs.mkdirSync(await this.resolveUrl(path.dirname(filepath)), {
        recursive: true,
      })
    }
  }

  async resolveUrl(filepath: string): Promise<string> {
    return path.resolve(this.root, filepath)
  }

  async listFiles(
    filepath: string,
    recursive: boolean = false,
  ): Promise<string[]> {
    const resolvedPath = await this.resolveUrl(filepath)
    const contents = fs.readdirSync(resolvedPath)
    const files = contents.filter((f) =>
      fs.statSync(path.join(resolvedPath, f)).isFile(),
    )
    if (recursive) {
      const subDirs = contents.filter((f) =>
        fs.statSync(path.join(resolvedPath, f)).isDirectory(),
      )
      const subFiles = await Promise.all(
        subDirs.map(async (subDir) => {
          const subDirPath = path.join(filepath, subDir)
          const subDirFiles = await this.listFiles(subDirPath, true)
          return subDirFiles.map((subDirFile) => path.join(subDir, subDirFile))
        }),
      ).then((files) => files.flat())
      return files.concat(subFiles)
    }
    return files
  }

  async exists(filepath: string): Promise<boolean> {
    return fs.existsSync(await this.resolveUrl(filepath))
  }

  async stat(filepath: string): Promise<FileStat> {
    const fileStats = fs.statSync(await this.resolveUrl(filepath))
    return {
      size: fileStats.size,
      mtimeMs: fileStats.mtimeMs,
    }
  }

  async write(filepath: string, data: Buffer | string): Promise<void> {
    await this.createDirIfNotExists(filepath)
    return fs.writeFileSync(await this.resolveUrl(filepath), data)
  }

  async read<T extends BufferEncoding | undefined>(
    filepath: string,
    encoding?: T,
  ): Promise<T extends undefined ? Buffer : string> {
    const buffer = fs.readFileSync(await this.resolveUrl(filepath))
    if (encoding)
      return buffer.toString(encoding) as T extends undefined ? Buffer : string
    return buffer as T extends undefined ? Buffer : string
  }

  async createWriteStream(filepath: string): Promise<Writable> {
    await this.createDirIfNotExists(filepath)
    return fs.createWriteStream(await this.resolveUrl(filepath))
  }
}
