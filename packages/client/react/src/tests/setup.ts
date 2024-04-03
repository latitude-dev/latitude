import 'cross-fetch/polyfill'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'

export const server = setupServer()

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())
