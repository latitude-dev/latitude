# `@latitude-data/jwt`

Latitude's JWT library. It's a simple library to generate and verify JWT tokens.
Under the hood is using [jose](https://github.com/panva/jose) library.

## Installation

```bash
npm add @latitude-data/jwt
```

## Usage for signing a token

```typescript
import { signJwt } from '@latitude-data/jwt'

const token = await signJwt({
  payload: { company_id: 1, admin: true },
  secretKey: '[LATITUDE_SECRET]',
  expiresIn: '2h', // Optional, by default is 2h
})
```

## Usage for verifying a token

```typescript
import { verifyJwt } from '@latitude-data/jwt'

const token '[SIGNED_JWT_TOKEN_ABOVE]' ☝️

const response = await veryfyJwt({
  secretKey: '[LATITUDE_SECRET]',
  token,
})

if (response instanceof Error) {
  console.log('Do something with the error')
}

const { payload } = response

// payload = { company_id: 1, admin: true }
```
