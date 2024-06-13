import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { DiskDriver, DiskDriverConfig } from '.'
import mockFs from 'mock-fs'
import fs from 'fs'
import path from 'path'

const config: DiskDriverConfig = {
  path: '/mocked/path',
}

describe('DiskDriver', () => {
  let driver: DiskDriver

  beforeEach(() => {
    mockFs({
      '/mocked/path': {},
    })
    driver = new DiskDriver(config)
  })

  afterEach(() => {
    mockFs.restore()
  })

  it('should resolve url correctly', async () => {
    const resolvedPath = await driver.resolveUrl('file.txt')
    expect(resolvedPath).toBe(path.resolve('/mocked/path', 'file.txt'))
  })

  it('should create directory if it does not exist', async () => {
    const dirPath = '/mocked/path/newdir'
    await driver.write(path.join('newdir', 'file.txt'), Buffer.from('data'))
    expect(fs.existsSync(dirPath)).toBe(true)
  })

  it('should list files in a directory', async () => {
    mockFs({
      '/mocked/path': {
        'file1.txt': 'content1',
        'file2.txt': 'content2',
        subdir: {
          'file3.txt': 'content3',
        },
      },
    })
    const files = await driver.listFiles('')
    expect(files).toEqual(['file1.txt', 'file2.txt'])
  })

  it('should list files recursively', async () => {
    mockFs({
      '/mocked/path': {
        'file1.txt': 'content1',
        'file2.txt': 'content2',
        subdir: {
          'file3.txt': 'content3',
        },
      },
    })
    const files = await driver.listFiles('', true)
    expect(files).toEqual(['file1.txt', 'file2.txt', 'subdir/file3.txt'])
  })

  it('should check if file exists', async () => {
    mockFs({
      '/mocked/path': {
        'file.txt': 'content',
      },
    })
    const exists = await driver.exists('file.txt')
    expect(exists).toBe(true)
  })

  it('should check if file does not exist', async () => {
    const exists = await driver.exists('nonexistent.txt')
    expect(exists).toBe(false)
  })

  it('should return file stats', async () => {
    mockFs({
      '/mocked/path': {
        'file.txt': 'content',
      },
    })
    const stats = await driver.stat('file.txt')
    expect(stats.isFile()).toBe(true)
  })

  it('should write data to a file', async () => {
    const filePath = 'file.txt'
    const data = Buffer.from('hello world')
    await driver.write(filePath, data)
    const content = fs.readFileSync(path.resolve('/mocked/path', filePath))
    expect(content.toString()).toBe('hello world')
  })

  it('should read data from a file', async () => {
    const filePath = 'file.txt'
    mockFs({
      '/mocked/path': {
        [filePath]: 'hello world',
      },
    })
    const data = await driver.read(filePath)
    expect(data.toString()).toBe('hello world')
  })

  it('should create a write stream', async () => {
    const filePath = 'file.txt'
    mockFs({
      '/mocked/path': {},
    })
    const stream = await driver.createWriteStream(filePath)
    stream.write('hello world')
    stream.end()
    await new Promise((resolve) => stream.on('close', resolve)) // Wait for stream to close

    const content = fs.readFileSync('/mocked/path/file.txt')
    expect(content.toString()).toBe('hello world')
  })

  it('should create a read stream', async () => {
    mockFs({
      '/mocked/path': {},
    })
    const writeStream = await driver.createWriteStream('file.txt')
    const readStream = await driver.createReadStream('file.txt')

    let readBuffers: Buffer[] = []
    readStream.on('data', (buffer) => {
      readBuffers.push(buffer)
    })

    writeStream.write('hello world')
    writeStream.end()
    await new Promise((resolve) => writeStream.on('close', resolve)) // Wait for stream to close

    expect(readBuffers).toEqual([Buffer.from('hello world')])
  })
})
