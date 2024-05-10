---
"@latitude-data/svelte": minor
"example-react": minor
"@latitude-data/react": minor
"@latitude-data/client": minor
"@latitude-data/cli": minor
"@latitude-data/server": minor
---

This release includes the following changes.

**React components**
We have added [all components](https://docs.latitude.so/views/components/content/text) available in regular Latitude apps – except for the Input component – to our React library. Now users have a complete, native way to embed their Latitude projects into their React applications, no iframes involved.

**Latitude secrets**
We've added complete secret management to Latitude Cloud. This change means users can now safely declare secrets for their apps and they will become available as regular environment variables in their production environment. To add a secret simply run:

```bash
latitude secrets add SECRET_NAME=SECRET_VALUE
```
