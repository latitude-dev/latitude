import { describe, it, expect, vi, afterEach } from 'vitest'
import { addDockerfiles } from './fromSetup'
import fs from 'fs'

vi.mock('fs')
vi.mock('path', () => {
  return {
    default: {
      resolve: vi.fn((...args) => args.join('/')),
    },
  }
})
vi.mock('$src/config', () => ({
  default: {
    rootDir: '/mocked/path',
  },
}))

const dockerignorePath = '/mocked/path/.dockerignore'
const dockerfilePath = '/mocked/path/Dockerfile'

describe('addDockerfiles', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('creates .dockerignore and Dockerfile if they do not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    addDockerfiles()

    expect(fs.existsSync).toHaveBeenCalledWith(dockerignorePath)
    expect(fs.existsSync).toHaveBeenCalledWith(dockerfilePath)
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      dockerignorePath,
      expect.any(String),
    )
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      dockerfilePath,
      expect.any(String),
    )
  })

  it('does not recreate .dockerignore or Dockerfile if they already exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)

    addDockerfiles()

    expect(fs.writeFileSync).not.toHaveBeenCalled()
  })
})
