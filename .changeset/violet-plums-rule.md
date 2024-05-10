---
"@latitude-data/svelte": minor
"example-react": minor
"@latitude-data/react": minor
"@latitude-data/client": minor
"@latitude-data/cli": minor
"@latitude-data/server": minor
---

This release implements the following changes.

You can now add secrets to production apps deployed to [Latitude Cloud](https://docs.latitude.so/guides/deploy/latitude_cloud#sign-up-to-latitude-cloud). To do so run:

```bash
latitude secrets add SECRET_NAME=SECRET_VALUE
```

These secrets become available as environment variables in the production environment of your Latitude project, which means they can replace any values users write in .env files during development.

We've added native react component to our React library. This release implements all the [visualization components](https://docs.latitude.so/views/components/visualizations/table) available at Latitude. Combined with useQuery hook, it means users now have a complete, native way to embed their Latitude visualizations into their React apps. On top of this, we've also added complete support for themes, so users can quickly and easily change the color schema of Latitude visualizations to match their website's style.
