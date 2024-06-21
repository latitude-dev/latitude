import { PromptConfig } from '$/types'
import { Model } from '..'
import OpenAI from 'openai'

type OpenAIDetails = {
  apiKey: string
}

const DEFAULT_CONFIG: PromptConfig = {
  model: 'gpt-4o',
  temperature: 0.1,
  top_p: 1,
  seed: undefined,
  json: false,
}

export default class OpenAIModel extends Model {
  protected async generate({
    prompt,
    config,
    onToken,
  }: {
    prompt: string
    config: PromptConfig
    onToken?: (batch: string, last: boolean) => Promise<void>
  }): Promise<string> {
    const details = this.schema.details as OpenAIDetails
    const openai = new OpenAI({ apiKey: details.apiKey })
    const stream = await openai.chat.completions.create({
      model: config.model ?? DEFAULT_CONFIG.model!,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      temperature: config.temperature ?? DEFAULT_CONFIG.temperature!,
      top_p: config.top_p ?? DEFAULT_CONFIG.top_p!,
      seed: config.seed ?? DEFAULT_CONFIG.seed!,
      response_format: {
        type: config.json ?? DEFAULT_CONFIG.json! ? 'json_object' : 'text',
      },
      stream: true,
    })

    let completeResponse = ''
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content
      if (!text) continue
      completeResponse += text
      await onToken?.(text, false)
    }
    await onToken?.('', true) // Signal the end of the stream

    return completeResponse
  }
}
