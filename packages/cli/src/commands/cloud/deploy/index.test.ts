import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import deployCommand from '.'
import chalk from 'chalk'

vi.mock('$src/config', () => ({
  default: {
    dev: true,
  },
}))

vi.mock('$src/lib/server', () => {
  return {
    request: vi.fn().mockRejectedValueOnce({
      status: 401,
      message: 'Unauthorized',
    }),
  }
})

vi.mock('$src/lib/latitudeConfig/findConfigFile', () => {
  return {
    default: vi.fn().mockReturnValue({
      data: { name: 'test-app' },
    }),
  }
})

vi.mock('ora', () => {
  return {
    default: vi.fn().mockReturnValue({
      start: function () {
        return this
      },
      stop: function () {},
    }),
  }
})

describe('deployCommand', () => {
  let consoleErrorMock: any

  beforeEach(() => {
    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorMock.mockRestore()
  })

  it('displays a correct message when deploying without being logged in', async () => {
    await expect(deployCommand()).rejects.toThrow()
    expect(consoleErrorMock).toHaveBeenCalledWith(
      chalk.yellow(`
You are not logged in. Please run the following command to sign up:

    ${chalk.cyan('latitude signup')}

If you have already signed up, please run the following command to log in:

    ${chalk.cyan('latitude login')}
`),
    )
  })
})
