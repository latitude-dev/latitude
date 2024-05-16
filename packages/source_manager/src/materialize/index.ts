import DiskDriver from '@/materialize/drivers/disk/DiskDriver'

export const STORAGE_TYPES = {
  disk: 'disk',
}

export type StorageType = keyof typeof STORAGE_TYPES

type DriverConfig<T extends StorageType> = T extends 'disk'
  ? { path: string }
  : never

export type StorageConfig<T extends StorageType> = {
  type: T
  config: DriverConfig<T>
}

export function buildStorageDriver<T extends StorageType>({
  type,
  config,
}: StorageConfig<T>) {
  switch (type) {
    case STORAGE_TYPES.disk:
      return new DiskDriver(config)
    default: {
      return null
    }
  }
}
