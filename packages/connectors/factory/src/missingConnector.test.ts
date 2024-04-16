import * as fs from 'fs'

import { it, describe, beforeEach, expect } from 'vitest'
import { vi } from 'vitest'
import { createConnector } from './index'

vi.mock('@latitude-data/postgresql-connector', () => ({
  default: 'a simple string',
}))

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}))

const sourcePath = '/path/to/source.yaml'

describe('createConnector', () => {
  beforeEach(() => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(
      `
      type: postgres
      details:
        host: localhost
        port: 5432
        user: myuser
        password: mypassword
        database: mydatabase
    `,
    )
  })

  it('throws an error if connector class is not found', async () => {
    await expect(createConnector(sourcePath)).rejects.toThrowError(
      'Module @latitude-data/postgresql-connector is not a valid Latitude connector. Please make sure you installed in your project npm install @latitude-data/postgresql-connector',
    )
  })
})
