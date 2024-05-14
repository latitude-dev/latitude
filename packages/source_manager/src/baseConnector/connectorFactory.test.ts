import { it, describe, expect } from 'vitest'
import { vi } from 'vitest'
import createConnectorFactory from './connectorFactory'
import { ConnectorType } from '@/types'
import { createDummySource } from '@/tests/helper'

const source = createDummySource()

describe('createConnectorFactory', () => {
  it('fails when connector type is not valid', async () => {
    await expect(
      createConnectorFactory({
        // @ts-expect-error - mock is not a valid type in the ConnectorType enum
        type: 'not-valid-connector',
        connectorOptions: { source, connectionParams: {} },
      }),
    ).rejects.toThrowError('Unsupported connector type: not-valid-connector')
  })

  it('fails when connector is not installed', async () => {
    await expect(
      createConnectorFactory({
        type: ConnectorType.Mssql,
        connectorOptions: { source, connectionParams: {} },
      }),
    ).rejects.toThrowError(
      "Module @latitude-data/mssql-connector is not a valid Latitude connector. Please make sure you have the correct package installed in your project by running 'npm install @latitude-data/mssql-connector'",
    )
  })

  it('fails when connector has not default import', async () => {
    vi.doMock('@latitude-data/mssql-connector', () => ({
      default: {},
    }))
    await expect(
      createConnectorFactory({
        type: ConnectorType.Mssql,
        connectorOptions: { source, connectionParams: {} },
      }),
    ).rejects.toThrowError(
      'Module @latitude-data/mssql-connector does not have a default export.',
    )
  })
})
