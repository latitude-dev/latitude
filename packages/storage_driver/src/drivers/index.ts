import { StorageDriverConfig, StorageType } from '$/types'
import { StorageDriver } from './base'
import { DiskDriver } from '$/drivers/disk'
import { S3Driver } from './s3'

export function getStorageDriver(config: StorageDriverConfig): StorageDriver {
  switch (config.type) {
    case StorageType.disk:
      return new DiskDriver(config)
    case StorageType.s3:
      return new S3Driver(config)
    default:
      throw new Error(
        `Unknown storage driver type: ${(config as StorageDriverConfig).type}`,
      )
  }
}

export * from './base'
