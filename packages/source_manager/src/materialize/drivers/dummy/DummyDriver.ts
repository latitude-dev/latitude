import SourceManager from '@/manager'
import {
  GetUrlParams,
  ResolveUrlParams,
  StorageDriver,
} from '@/materialize/drivers/StorageDriver'

export default class DummyDriver extends StorageDriver {
  constructor({ manager }: { manager: SourceManager }) {
    super({ manager })
  }

  get basePath(): string {
    return '/dummy-base-path'
  }
  getUrl(args: GetUrlParams): Promise<string> {
    return this.resolveUrl({
      ...args,
      filename: `ENCRYPTED[${args.sqlHash}].parquet`,
    })
  }

  resolveUrl({ filename }: ResolveUrlParams): Promise<string> {
    return Promise.resolve(filename)
  }
}
