import { TOKEN_PARAM } from '@latitude-data/client'
import { type ValidTokenResponse, verifyJWT } from '@latitude-data/jwt'
const MASTER_KEY_NAME = 'LATITUDE_MASTER_KEY'
export const MISSING_KEY = `.env file is missing ${MASTER_KEY_NAME} token key`
export const GENERIC_MSG = 'Invalid token'
export type TokenResponse =
  | { valid: true; token?: ValidTokenResponse }
  | { valid: false; errorMessage: string }

export default async function loadToken({
  url,
}: {
  url: URL
}): Promise<TokenResponse> {
  const isProd = import.meta.env.PROD
  const masterKey = process.env[MASTER_KEY_NAME]
  const secretKey = !masterKey ? undefined : masterKey
  const jwtToken = url.searchParams.get(TOKEN_PARAM)

  if (!jwtToken) return { valid: true }

  if (!secretKey) {
    return {
      valid: false,
      errorMessage: isProd ? GENERIC_MSG : MISSING_KEY,
    }
  }

  const response = await verifyJWT({ secretKey, token: jwtToken })
  const hasError = response instanceof Error

  if (hasError) {
    return {
      valid: false,
      errorMessage: isProd ? GENERIC_MSG : response.message,
    }
  }

  return { valid: true, token: response }
}
