import { PromptConfig } from '$/types'
import { Model } from '..'

/**
 * Splits the given string using the specified separators, including the separators in the result too.
 * @example splitInclusive('foo bar', [' ', '-']) => ['foo', ' ', 'bar']
 */
export function splitInclusive(str: string, separators: string[]) {
  let result: string[] = [str]
  for (const separator of separators) {
    result = result
      .map((part) => {
        return part.split(separator).reduce((acc, chunk, index) => {
          if (index === 0) return [chunk]
          return [...acc, separator, chunk]
        }, [] as string[])
      })
      .flat()
      .filter(Boolean)
  }
  return result
}

const MIN_STREAM_DELAY = 0
const MAX_STREAM_DELAY = 10

/**
 * This is a mock model that can be used for testing purposes.
 * It does not connect to API and returns a result based on
 * the input prompt.
 *
 * Each line in the prompt will be treated as plain text that will
 * be returned as the response.
 *
 * A line can also start with one of the following keywords to define
 * different behaviors:
 * - `FAIL <message>` will throw an error with the given message.
 * - `SLEEP <ms>` will wait for the given number of milliseconds.
 */
export default class TestModel extends Model {
  protected async generate({
    prompt,
    onToken,
  }: {
    prompt: string
    config: PromptConfig
    onToken?: (batch: string, last: boolean) => Promise<void>
  }): Promise<string> {
    const lines = prompt.split('\n')
    let fullResponse = ''

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex]!
      const command = line.trim().split(' ')[0]
      if (command === 'FAIL') {
        throw new Error(line.trim().split(' ').slice(1).join(' '))
      }

      if (command === 'SLEEP') {
        const time = parseInt(line.trim().split(' ').slice(1).join(' '))
        await new Promise((resolve) => setTimeout(resolve, time))
        continue
      }

      const separators = [' ', '\n']
      const tokens = splitInclusive(line, separators).reduce((acc, token) => {
        if (separators.includes(token)) {
          acc.push(token)
        } else {
          const chunks = token.match(/.{1,6}/g) ?? []
          acc = acc.concat(...chunks)
        }
        return acc
      }, [] as string[])

      for (let i = 0; i < tokens.length; i++) {
        onToken?.(tokens[i]!, false)
        fullResponse += tokens[i]!

        const delay =
          Math.random() * (MAX_STREAM_DELAY - MIN_STREAM_DELAY) +
          MIN_STREAM_DELAY
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      if (lineIndex !== lines.length - 1) {
        await onToken?.('\n', false)
        fullResponse += '\n'
      }
    }

    await onToken?.('', true) // Signal the end of the stream
    return fullResponse
  }
}
