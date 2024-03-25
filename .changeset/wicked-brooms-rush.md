---
"@latitude-data/client": minor
"@latitude-data/cli": minor
"@latitude-data/jwt": minor
"@latitude-data/server": minor
---

- Signed params. Allow users to sign params so they can be send encrypted to latitude server. This is helpful for embedding latitude in a client side application in a iframe
- Fix bug related with `__force` param not being interpreted correctly because
  it was sent as `$text:true` instead of `true` so query was not recomputed
