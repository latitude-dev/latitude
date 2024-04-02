import assertLatitudeProject from '.'
import fs from 'fs'
import * as utils from '$src/utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mocking fs and utils
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
  },
}))

vi.mock('$src/utils', () => ({
  onError: vi.fn(),
}))

const mock = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit(1)')
})

describe('assertLatitudeProject', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should proceed with the command function if LATITUDE_CONFIG_FILE exists', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)

    const commandFunction = vi.fn()
    const wrappedFunction = assertLatitudeProject(commandFunction)

    await wrappedFunction('arg1', 'arg2')

    expect(commandFunction).toHaveBeenCalledWith('arg1', 'arg2')
    expect(mock).not.toHaveBeenCalled()
  })

  it('should call onError and exit if LATITUDE_CONFIG_FILE does not exist', async () => {
    // Assume LATITUDE_CONFIG_FILE does not exist
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const commandFunction = vi.fn()
    const wrappedFunction = assertLatitudeProject(commandFunction)

    try {
      await wrappedFunction()
    } catch (error) {
      // Check error thrown due to process.exit mock throwing
      expect((error as Error).message).toMatch(/process\.exit\(1\)/)
    }

    // Check that onError was called correctly
    expect(utils.onError).toHaveBeenCalledWith({
      message:
        'The current directory is not a Latitude project. Move to an actual Latitude project or run `latitude setup` in the current directory to set it up as a Latitude project.',
    })
  })
})
