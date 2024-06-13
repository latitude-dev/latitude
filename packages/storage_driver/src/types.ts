import type { DiskDriverConfig } from '$/drivers/disk'

export enum StorageType {
  disk = 'disk',
}

interface IStorageDriverConfig {
  type: StorageType
}

type FullDiskDriverConfig = IStorageDriverConfig & {
  type: StorageType.disk
} & DiskDriverConfig

export type StorageDriverConfig = FullDiskDriverConfig

export interface FileStat {
  size: number // Number of bytes
  mtimeMs: number // Number of milliseconds since the epoch
}
