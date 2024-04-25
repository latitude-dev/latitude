import { describe, it, expect, vi, beforeEach } from 'vitest'
import { existsSync, writeFileSync } from 'fs'
import { addDockerfiles } from '.'

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  writeFileSync: vi.fn(),
}))

vi.mock('path', () => ({
  default: {
    resolve: (...args: string[]) => args.join('/'),
  },
}))

vi.mock('$src/config', () => ({
  default: {
    rootDir: '/mocked/dir',
  },
}))

describe('addDockerfiles', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should create both .dockerignore and Dockerfile when they do not exist', async () => {
    ;(existsSync as any).mockReturnValue(false)

    addDockerfiles({ force: false })

    expect(writeFileSync).toHaveBeenCalledTimes(2)
    expect(writeFileSync).toHaveBeenCalledWith(
      '/mocked/dir/.dockerignore',
      expect.any(String),
    )
    expect(writeFileSync).toHaveBeenCalledWith(
      '/mocked/dir/Dockerfile',
      expect.any(String),
    )
  })

  it('should not create files when they exist and force is false', async () => {
    ;(existsSync as any).mockReturnValue(true)

    addDockerfiles({ force: false })

    expect(writeFileSync).not.toHaveBeenCalled()
  })

  it('should force create files even when they exist', async () => {
    ;(existsSync as any).mockReturnValue(true)

    addDockerfiles({ force: true })

    expect(writeFileSync).toHaveBeenCalledTimes(2)
  })
})
