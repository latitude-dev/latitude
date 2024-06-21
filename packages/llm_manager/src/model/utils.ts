import path from 'path'

export function getFullPromptPath({
  referencedPromptPath,
  currentPromptPath,
}: {
  referencedPromptPath: string
  currentPromptPath: string
}): string {
  return referencedPromptPath.startsWith('/')
    ? referencedPromptPath
    : path.join(path.dirname(currentPromptPath), referencedPromptPath)
}

export function assertNoCyclicReferences(
  promptPath: string,
  promptsBeingCompiled: string[],
): void {
  const promptName = promptPath.replace(/.prompt$/, '')

  if (!promptsBeingCompiled.includes(promptName)) return

  throw new Error(
    'Prompt reference to a parent, resulting in cyclic references.',
  )
}
