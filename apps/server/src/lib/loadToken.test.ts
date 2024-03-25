import { describe, it, expect } from 'vitest'
import { signJwt } from '@latitude-data/jwt'
import loadToken, { GENERIC_MSG, MISSING_KEY } from './loadToken'

describe('loadToken', () => {
  it('load ok when no token present', async () => {
    const url = new URL('http://example.com')
    const response = await loadToken({ url })

    expect(response).toEqual({ valid: true })
  })

  it('load failed when invalid token is passed', async () => {
    const url = new URL('http://example.com?__token=invalid')
    const response = await loadToken({ url })

    expect(response).toEqual({
      valid: false,
      errorMessage: MISSING_KEY
    })
  })

  it('show generic message when invalid token is passed in prod', async () => {
    import.meta.env.PROD = true
    const url = new URL('http://example.com?__token=invalid')
    const response = await loadToken({ url })

    expect(response).toEqual({
      valid: false,
      errorMessage: GENERIC_MSG
    })
    import.meta.env.PROD = false
  })

  it('verify jwt token when process.env.LATITUDE_MASTER_KEY is set', async () => {
    process.env['LATITUDE_MASTER_KEY'] = 'SECRET_MASTER_KEY'
    const url = new URL('http://example.com?__token=valid')
    const response = await loadToken({ url })
    expect(response).toEqual({
      valid: false,
      errorMessage: 'Invalid Compact JWS'
    })
  })

  it('verify jwt token when process.env.LATITUDE_MASTER_KEY is set in prod', async () => {
    import.meta.env.PROD = true
    process.env['LATITUDE_MASTER_KEY'] = 'SECRET_MASTER_KEY'
    const url = new URL('http://example.com?__token=valid')
    const response = await loadToken({ url })
    expect(response).toEqual({
      valid: false,
      errorMessage: GENERIC_MSG
    })
    import.meta.env.PROD = false
  })

  it('verify a valid jwt', async () => {
    const secretKey = 'SECRET_MASTER_KEY'
    process.env['LATITUDE_MASTER_KEY'] = secretKey
    const userID = 1
    const token = await signJwt({
      payload: {
        iss: 'latitude-user',
        sub: userID.toString(),
        aud: 'latitude',
        company_id: 33
      },
      secretKey
    })
    const url = new URL(`http://example.com?__token=${token}`)
    const response = await loadToken({ url })
    expect(response).toEqual({
      valid: true,
      token: {
        metadata: {
          iss: 'latitude-user',
          sub: '1',
          aud: 'latitude',
          exp: expect.any(Number),
          iat: expect.any(Number),
        },
        payload: {
          company_id: 33,
        },
        protectedHeader: {
          alg: 'HS256',
        },
      }
    })
  })
})
