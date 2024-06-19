import { describe, expect, it } from 'vitest'
import { resolveSecrets } from './index'

describe('resolveSecrets', () => {
  it('should resolve secrets', () => {
    const config = {
      secret1: 'LATITUDE__SECRET1',
      secret2: 'LATITUDE__SECRET2',
    }

    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env['LATITUDE__SECRET1'] = 'supersecret1'
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env['LATITUDE__SECRET2'] = 'supersecret2'

    const resolvedSecrets = resolveSecrets({ unresolvedSecrets: config })

    expect(resolvedSecrets.secret1).toBe('supersecret1')
    expect(resolvedSecrets.secret2).toBe('supersecret2')
  })

  it('should resolve nested secrets', () => {
    const config = {
      secret: {
        secret: 'LATITUDE__SECRET1',
        notASecret: 33,
      },
    }
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env['LATITUDE__SECRET1'] = 'supersecret1'
    const resolvedSecrets = resolveSecrets({ unresolvedSecrets: config })
    const firstLevel = resolvedSecrets.secret as {
      secret: string
      notASecret: number
    }

    expect(firstLevel.secret).toBe('supersecret1')
    expect(firstLevel.notASecret).toBe(33)
  })

  it('should throw error when environment variable is not found', () => {
    const config = {
      secret3: 'LATITUDE__SECRET3',
    }

    expect(() => {
      resolveSecrets({ unresolvedSecrets: config })
    }).toThrowError(
      new Error(
        `Invalid configuration. Environment variable LATITUDE__SECRET3 was not found in the environment.`,
      ),
    )
  })
})
