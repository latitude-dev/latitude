import SourceManager from '@/manager'
import DiskDriver from '@/materialize/drivers/disk/DiskDriver'
import DummyDriver from '@/materialize/drivers/dummy/DummyDriver'

export {
  default as findAndMaterializeQueries,
  findAllMaterializableQueries,
  type MaterializationInfo,
} from './findAndMaterializeQueries'
export const STORAGE_TYPES = { disk: 'disk' }
export type StorageType = keyof typeof STORAGE_TYPES
export type FullDriverConfig<T extends StorageType> = DriverConfig<T> & {
  manager: SourceManager
}
export type DriverConfig<T extends StorageType> = T extends 'disk'
  ? { path: string }
  : never
export type StorageConfig<T extends StorageType> = {
  type: T
  config: DriverConfig<T>
}
export type StorageKlass = typeof DiskDriver | typeof DummyDriver

export function getDriverKlass({
  type,
}: {
  type: StorageType
}): StorageKlass | null {
  switch (type) {
    case STORAGE_TYPES.disk:
      return DiskDriver
    default: {
      return null
    }
  }
}
