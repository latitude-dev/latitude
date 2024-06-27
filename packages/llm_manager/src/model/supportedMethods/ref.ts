import { BuildSupportedMethodsArgs } from '$/types'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'
import { assertNoCyclicReferences, getFullPromptPath } from '../utils'

const buildRefMethod = ({
  model,
  context,
}: BuildSupportedMethodsArgs): SupportedMethod => ({
  requirements: {
    interpolationPolicy: 'require', // Cannot be used inside a logic block
    interpolationMethod: 'raw', // When interpolating, will just inject the returned value directly into the prompt
    requireStaticArguments: false, // Can only use static arguments
  },

  resolve: async (referencedPrompt: string) => {
    if (typeof referencedPrompt !== 'string') {
      throw new Error('Invalid reference prompt')
    }

    const fullSubPromptPath = getFullPromptPath({
      referencedPromptPath: referencedPrompt,
      currentPromptPath: context.request.promptPath,
    })

    assertNoCyclicReferences(fullSubPromptPath, context.promptsBeingCompiled)

    const refModel = await model.manager.loadFromPrompt(fullSubPromptPath)
    if (refModel !== model) {
      throw new Error('Prompt reference to a different model')
    }

    const refRequest = {
      promptPath: fullSubPromptPath,
      params: context.request.params,
    }
    const { request: _, ...refContext } = context // Everything except request is passed to the subprompt context
    const compiledSubPrompt = await model.compilePrompt(
      refRequest,
      context.onDebug,
      refContext,
    )

    return compiledSubPrompt.prompt
  },

  readMetadata: async () => {
    return emptyMetadata()
  },
})

export default buildRefMethod
