import { describe, it, expect, vi, beforeEach } from 'vitest'
import chalk from 'chalk'
import { existsSync } from 'fs'
import { writeFile } from './_shared'
import { addDockerfiles } from './fromUpdate'

vi.mock('fs', () => ({
  existsSync: vi.fn(),
}))
vi.mock('./_shared', () => ({
  writeFile: vi.fn(),
}))

vi.mock('$src/config', () => ({
  default: {
    rootDir: '/mocked/path',
  },
}))

describe('addDockerfiles', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('should add both .dockerignore and Dockerfile if they do not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false)
    addDockerfiles()
    expect(writeFile).toHaveBeenCalledTimes(2)
    expect(writeFile).toHaveBeenCalledWith({
      type: 'dockerignore',
      path: '/mocked/path/.dockerignore',
    })
    expect(writeFile).toHaveBeenCalledWith({
      type: 'dockerfile',
      path: '/mocked/path/Dockerfile',
    })
  })

  it('should not add .dockerignore or Dockerfile if they exist and force is false', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    addDockerfiles()
    expect(writeFile).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith(
      chalk.yellow(
        'Dockerignore file already exists. Run latitude update --force to update it.',
      ),
    )
  })

  it('should add .dockerignore and Dockerfile even if they exist when force is true', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    addDockerfiles({ force: true })
    expect(writeFile).toHaveBeenCalledTimes(2)
  })
})
