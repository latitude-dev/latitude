import { it, describe, expect } from 'vitest'
import { vi } from 'vitest'
import createConnector, { ConnectorType } from '.'

vi.mock('@latitude-data/test-connector', () => ({
  default: 'a simple string',
}))

describe('createConnector', () => {
  it('throws an error if connector class is not found', async () => {
    const rootPath = 'path/to/queries'
    const type = ConnectorType.Test
    const details = {
      fail: false,
    }

    await expect(createConnector(rootPath, type, details)).rejects.toThrowError(
      `Module @latitude-data/test-connector is not a valid Latitude connector. Please make sure you have the correct package installed in your project by running 'npm install @latitude-data/test-connector'`,
    )
  })
})
