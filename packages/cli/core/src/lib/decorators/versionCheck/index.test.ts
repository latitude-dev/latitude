import { vi, describe, it, expect, beforeEach } from 'vitest'
import versionCheck from '.'
import boxedMessage from '$src/lib/boxedMessage'
import configStore from '$src/lib/configStore'
import latestVersion from 'latest-version'
import { CLI_PACKAGE_NAME } from '$src/commands/constants'

vi.mock('$src/lib/boxedMessage', () => ({ default: vi.fn() }))
vi.mock('$src/lib/configStore', () => ({
  default: { get: vi.fn(), set: vi.fn() },
}))
vi.mock('latest-version', () => ({ default: vi.fn() }))

describe('versionCheck', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should check for updates when it has never been checked before', async () => {
    const args = ['foo']
    const mock = vi.fn()

    // @ts-expect-error mock
    configStore.get.mockReturnValueOnce(undefined)
    // @ts-expect-error mock
    latestVersion.mockResolvedValueOnce('1.0.0')

    await versionCheck(mock)(args)

    expect(latestVersion).toHaveBeenCalledWith(CLI_PACKAGE_NAME)
    expect(mock).toHaveBeenCalledWith(args)
    expect(boxedMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Update available',
        color: 'yellow',
        textAlignment: 'center',
      }),
    )
  })

  it('should not check when it has been checked less than a day ago', async () => {
    const args = ['foo']
    const mock = vi.fn()

    // @ts-expect-error mock
    configStore.get.mockReturnValueOnce(Date.now())
    // @ts-expect-error mock
    latestVersion.mockResolvedValueOnce('1.0.0')

    await versionCheck(mock)(args)

    expect(latestVersion).not.toHaveBeenCalled()
    expect(mock).toHaveBeenCalledWith(args)
    expect(boxedMessage).not.toHaveBeenCalled()
  })

  it('should not call boxedmessage if latest version is same than current', async () => {
    const args = ['foo']
    const mock = vi.fn()

    // @ts-expect-error mock
    configStore.get.mockReturnValueOnce(undefined)
    // @ts-expect-error mock
    latestVersion.mockResolvedValueOnce(process.env.PACKAGE_VERSION)

    await versionCheck(mock)(args)

    expect(latestVersion).toHaveBeenCalledWith(CLI_PACKAGE_NAME)
    expect(mock).toHaveBeenCalledWith(args)
    expect(boxedMessage).not.toHaveBeenCalled()
  })
})
