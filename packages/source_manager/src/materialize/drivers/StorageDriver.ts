import { createHash } from 'crypto'

export type GetUrlParams = { sql: string; queryName: string; queryPath: string }
export type ResolveUrlParams = GetUrlParams & { filename: string }
export class MaterializedFileNotFoundError extends Error {}

/**
 * In order to hash a SQL query, we need to know the source path
 * it came from. This way we ensure the path is unique even
 * if two sources share the same query.
 */
export abstract class StorageDriver {
  getUrl(args: GetUrlParams): Promise<string> {
    const name = this.hashName(args)
    const filename = `${name}.parquet`

    return this.resolveUrl({ ...args, filename })
  }

  /**
   * It's a Promise because other adapters can be async
   */
  abstract resolveUrl({ filename }: ResolveUrlParams): Promise<string>

  private hashName({ sql, queryPath }: GetUrlParams) {
    const hash = createHash('sha256')
    return hash.update(`${sql}__${queryPath}`).digest('hex')
  }
}
