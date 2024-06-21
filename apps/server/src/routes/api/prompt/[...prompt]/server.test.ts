import { describe, it, expect, vi, beforeEach } from 'vitest'
import mockFs from 'mock-fs'
import { GET } from './+server'
import { PROMPTS_DIR, QUERIES_DIR } from '$lib/constants'

const regularPrompt = 'Lorem ipsum\ndolor sit amet'
const failingPromptError = 'Boom! The stream exploded 💥'
const failingPrompt = `
  Lorem ipsum dolor sit amet
  FAIL ${failingPromptError}
  Consectetur adipiscing elit
`
const paramPrompt = 'Hello, my name is {param("name")}'

describe('GET endpoint', async () => {
  beforeEach(() => {
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: test',
        'testQuery.sql': 'SELECT * FROM table',
      },
      [PROMPTS_DIR]: {
        'source.yml': 'type: test',
        'testPrompt.prompt': regularPrompt,
        'failingPrompt.prompt': failingPrompt,
        'paramPrompt.prompt': paramPrompt,
      },
      '/tmp/.latitude': {},
    })
    vi.resetAllMocks()
    import.meta.env.PROD = false
  })

  it('returns plain text response for successful prompt execution without streaming', async () => {
    const response = await GET({
      params: { prompt: 'testPrompt' },
      url: new URL('http://localhost/api/prompt/testPrompt'),
    })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe(regularPrompt)
  })

  it('returns streaming response for successful prompt execution with streaming', async () => {
    const response = await GET({
      params: { prompt: 'testPrompt' },
      url: new URL('http://localhost/api/prompt/testPrompt?__stream=true'),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/event-stream')

    const reader = response!.body!.getReader()
    const decoder = new TextDecoder()
    let totalValue = ''
    let isDone = false
    let addNewline = false
    while (!isDone) {
      const { value, done } = await reader.read()
      isDone = done
      const rawValue = decoder.decode(value)
      if (rawValue.trim() === '') {
        // Empty line, indicates end of event
        addNewline = false
        continue
      }

      const [type, ...data] = rawValue.split(':')
      if (type !== 'data') continue // Ignore other messages

      if (addNewline) {
        totalValue += '\n'
      }

      addNewline = true
      totalValue += data.join(':').slice(1, -1) // Remove initial space and final linebreak
    }

    expect(totalValue).toBe(regularPrompt)
  })

  it('returns 500 status on prompt execution error', async () => {
    const response = await GET({
      params: { prompt: 'failingPrompt' },
      url: new URL('http://localhost/api/prompt/failingPrompt'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe(failingPromptError)
  })

  it('streams error response for prompt execution error when streaming', async () => {
    const response = await GET({
      params: { prompt: 'failingPrompt' },
      url: new URL('http://localhost/api/prompt/failingPrompt?__stream=true'),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/event-stream')

    let totalResponse = ''
    const reader = response!.body!.getReader()
    let isDone = false
    while (!isDone) {
      const { value, done } = await reader.read()
      try {
        totalResponse += new TextDecoder().decode(value)
      } catch (e) {
        totalResponse += value
      }
      isDone = done
    }

    const responseMessages = totalResponse.trimEnd().split('\n')
    const errorEvent = responseMessages[responseMessages.length - 2]
    const errorData = responseMessages[responseMessages.length - 1]
    expect(errorEvent).toBe('event: error')
    expect(errorData).toBe(`data: ${failingPromptError}`)
  })

  it('returns generic error in production mode on prompt execution error', async () => {
    import.meta.env.PROD = true

    const response = await GET({
      params: { prompt: 'failingPrompt' },
      url: new URL('http://localhost/api/prompt/failingPrompt?__stream=true'),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/event-stream')

    let totalResponse = ''
    const reader = response!.body!.getReader()
    let isDone = false
    while (!isDone) {
      const { value, done } = await reader.read()
      try {
        totalResponse += new TextDecoder().decode(value)
      } catch (e) {
        totalResponse += value
      }
      isDone = done
    }

    const responseMessages = totalResponse.trimEnd().split('\n')
    const errorEvent = responseMessages[responseMessages.length - 2]
    const errorData = responseMessages[responseMessages.length - 1]
    expect(errorEvent).toBe('event: error')
    expect(errorData).toBe(`data: There was an error running this prompt`)
  })

  it('returns 500 status if prompt parameter is missing', async () => {
    const response = await GET({
      params: { prompt: 'paramPrompt' },
      url: new URL('http://localhost/api/prompt/paramPrompt'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe(
      "Error calling function: \nError Missing parameter 'name' in request",
    )
  })
})
