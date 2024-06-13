import { StorageDriverConfig, StorageType } from '$/types'
import { StorageDriver } from './base'
import { DiskDriver } from '$/drivers/disk'

export function getStorageDriver(config: StorageDriverConfig): StorageDriver {
  switch (config.type) {
    case StorageType.disk:
      return new DiskDriver(config)
    default:
      throw new Error(`Unknown storage driver type: ${config.type}`)
  }
}

export * from './base'
