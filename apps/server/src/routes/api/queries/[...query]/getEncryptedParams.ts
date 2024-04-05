import loadToken from '$lib/loadToken'
import { IValue } from './castValue'

export default async function getEncryptedParams({ url }: { url: URL }) {
  const token = await loadToken({ url })

  if (!token.valid) {
    throw new Error(token.errorMessage)
  }

  return (token.token?.payload ?? {}) as { [key: string]: IValue }
}
