import type { DiskDriverConfig } from '$/drivers/disk'
import { S3DriverConfig } from './drivers/s3'

export enum StorageType {
  disk = 'disk',
  s3 = 's3',
}

interface IStorageDriverConfig {
  type: StorageType
}

type FullDiskDriverConfig = IStorageDriverConfig & {
  type: StorageType.disk
} & DiskDriverConfig

type FullS3DriverConfig = IStorageDriverConfig & {
  type: StorageType.s3
} & S3DriverConfig

export type StorageDriverConfig = FullDiskDriverConfig | FullS3DriverConfig

export interface FileStat {
  size: number // Number of bytes
  mtimeMs: number // Number of milliseconds since the epoch
}
