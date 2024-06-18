import { FileStat, StorageType } from '$/types'
import { StorageDriver } from '$/drivers/base'
import { Writable, Readable } from 'stream'
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import path from 'path'

export type S3DriverConfig = {
  bucket: string
  region: string
  accessKeyId: string
  secretAccessKey: string
}

export class S3Driver extends StorageDriver {
  public type = StorageType.s3
  private client: S3Client
  private bucket: string

  constructor(config: S3DriverConfig) {
    super()
    this.bucket = config.bucket
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
  }

  async resolveUrl(filepath: string): Promise<string> {
    return `s3://${this.bucket}/${filepath}`
  }

  async listFiles(
    filepath: string = '',
    recursive: boolean = false,
  ): Promise<string[]> {
    const params = {
      Bucket: this.bucket,
      Prefix: filepath,
    }

    const listObjects = async (token?: string): Promise<string[]> => {
      const response = await this.client.send(
        new ListObjectsV2Command({ ...params, ContinuationToken: token }),
      )
      const keys = response.Contents?.map((obj) => obj.Key || '') || []
      if (response.IsTruncated) {
        const nextKeys = await listObjects(response.NextContinuationToken)
        return keys.concat(nextKeys)
      }
      return keys
    }

    const allKeys = await listObjects()
    const relativeKeys = allKeys
      .map((key) => path.relative(filepath, key))
      .filter((key) => !key.startsWith('../'))
    if (recursive) return relativeKeys
    return relativeKeys.filter((key) => !key.includes('/'))
  }

  async exists(filepath: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: filepath,
        }),
      )
      return true
    } catch (error) {
      if ((error as Error).name === 'NotFound') {
        return false
      }
      throw error
    }
  }

  async stat(filepath: string): Promise<FileStat> {
    const response = await this.client.send(
      new HeadObjectCommand({
        Bucket: this.bucket,
        Key: filepath,
      }),
    )
    return {
      size: response.ContentLength ?? 0,
      mtimeMs: response.LastModified?.getTime() ?? 0,
    }
  }

  async write(filepath: string, data: Buffer | string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: filepath,
      Body: data,
    }
    await this.client.send(new PutObjectCommand(params))
  }

  async read<T extends BufferEncoding | undefined>(
    filepath: string,
    encoding?: T,
  ): Promise<T extends undefined ? Buffer : string> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: filepath,
      }),
    )

    const stream = response.Body as Readable
    const chunks: Buffer[] = []

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)
    if (encoding) {
      return buffer.toString(encoding) as T extends undefined ? Buffer : string
    }
    return buffer as T extends undefined ? Buffer : string
  }

  async move(from: string, to: string): Promise<void> {
    await this.client.send(
      new CopyObjectCommand({
        Bucket: this.bucket,
        Key: to,
        CopySource: this.bucket + '/' + from,
      }),
    )
    await this.delete(from)
  }

  async delete(filepath: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: filepath }),
    )
  }

  async createWriteStream(filepath: string): Promise<Writable> {
    const pass = new PassThrough()

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: filepath,
        Body: pass,
      },
    })

    const originalOn = pass.on.bind(pass)
    const CUSTOM_CLOSE_EVENT = '_s3_stream_end'

    pass.on = (event, ...args) => {
      if (event === 'close') event = CUSTOM_CLOSE_EVENT
      return originalOn(event, ...args)
    }

    upload
      .done()
      .then(() => pass.emit(CUSTOM_CLOSE_EVENT))
      .catch((error) => pass.emit('error', error))

    return pass
  }
}
