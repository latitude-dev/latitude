import * as jose from 'jose'
import { type JWTPayload, type JWTHeaderParameters } from 'jose'

const ALGORITHM = 'HS256'

function createSecret(secret: string) {
  return new TextEncoder().encode(secret)
}

export async function signJwt({
  payload,
  secretKey,
  expirationTime = '2h',
}: {
  payload: JWTPayload
  secretKey: string
  expirationTime?: string | number | Date
}) {
  try {
    const secret = createSecret(secretKey)
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secret)

    return jwt
  } catch (error) {
    return error as Error
  }
}

const JWT_CLAIMS = [
  'iss',
  'sub',
  'aud',
  'jti',
  'nbf',
  'exp',
  'iat'
] as const

function splitMetadataFromPayload(token: JWTPayload) {
  return Object.keys(token).reduce((acc, key) => {
    if (JWT_CLAIMS.includes(key as any)) {
      acc.metadata[key] = token[key]
    } else {
      acc.payload[key] = token[key]
    }

    return acc
  },
  { metadata: {} as JWTPayload, payload: {} as JWTPayload })
}

export type ValidTokenResponse = {
  payload: JWTPayload
  metadata: JWTPayload
  protectedHeader: JWTHeaderParameters
}
type Response = ValidTokenResponse | Error

export async function verifyJWT({ secretKey, token }: { secretKey: string; token: string }): Promise<Response> {
  try {
    const secret = createSecret(secretKey)
    const { payload: allData, protectedHeader } = await jose.jwtVerify(
      token,
      secret,
      { algorithms: [ALGORITHM] }
    )
    const { payload, metadata } = splitMetadataFromPayload(allData)

    return { payload, metadata, protectedHeader }
  } catch (error) {
    return error as Error
  }
}
