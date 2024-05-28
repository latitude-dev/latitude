import path from 'path'

export function getFullQueryPath({
  referencedQueryPath,
  currentQueryPath,
}: {
  referencedQueryPath: string
  currentQueryPath: string
}): string {
  return referencedQueryPath.startsWith('/')
    ? referencedQueryPath
    : path.join(path.dirname(currentQueryPath), referencedQueryPath)
}

export function assertNoCyclicReferences(
  queryPath: string,
  queriesBeingCompiled: string[],
): void {
  const queryName = queryPath.replace(/.sql$/, '')

  if (!queriesBeingCompiled.includes(queryName)) return

  throw new Error(
    'Query reference to a parent, resulting in cyclic references.',
  )
}
