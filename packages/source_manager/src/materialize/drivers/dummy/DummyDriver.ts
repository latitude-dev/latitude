import {
  GetUrlParams,
  ResolveUrlParams,
  StorageDriver,
} from '@/materialize/drivers/StorageDriver'

export default class DummyDriver extends StorageDriver {
  getUrl(args: GetUrlParams): Promise<string> {
    return this.resolveUrl({
      ...args,
      filename: `ENCRYPTED[${args.sql}].parquet`,
    })
  }

  resolveUrl({ filename }: ResolveUrlParams): Promise<string> {
    return Promise.resolve(filename)
  }
}
