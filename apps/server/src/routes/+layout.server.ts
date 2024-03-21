import loadToken, { type TokenResponse } from '$lib/loadToken'
import { type Load } from '@sveltejs/kit'

export const load: Load<object, TokenResponse> = async ({ url }) => {
  return loadToken({ url })
}
