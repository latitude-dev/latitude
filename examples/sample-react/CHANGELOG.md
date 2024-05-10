# example-react

## 0.1.0

### Minor Changes

- dad171b: This release implements the following changes.

  You can now add secrets to production apps deployed to [Latitude Cloud](https://docs.latitude.so/guides/deploy/latitude_cloud#sign-up-to-latitude-cloud). To do so run:

  ```bash
  latitude secrets add SECRET_NAME=SECRET_VALUE
  ```

  These secrets become available as environment variables in the production environment of your Latitude project, which means they can replace any values users write in .env files during development.

  We've added native react component to our React library. This release implements all the [visualization components](https://docs.latitude.so/views/components/visualizations/table) available at Latitude. Combined with useQuery hook, it means users now have a complete, native way to embed their Latitude visualizations into their React apps. On top of this, we've also added complete support for themes, so users can quickly and easily change the color schema of Latitude visualizations to match their website's style.

### Patch Changes

- Updated dependencies [f8ce2e6]
- Updated dependencies [5e52691]
- Updated dependencies [4661d83]
- Updated dependencies [6b2a69e]
- Updated dependencies [dad171b]
- Updated dependencies [c39ebae]
- Updated dependencies [c26e405]
  - @latitude-data/react@0.7.0

## 0.0.8-next.6

### Patch Changes

- Updated dependencies [5e52691]
  - @latitude-data/react@0.7.0-next.6

## 0.0.8-next.5

### Patch Changes

- Updated dependencies [4661d83]
  - @latitude-data/react@0.7.0-next.5

## 0.0.8-next.4

### Patch Changes

- Updated dependencies [c26e405]
  - @latitude-data/react@0.7.0-next.4

## 0.0.8-next.3

### Patch Changes

- Updated dependencies [6b2a69e]
  - @latitude-data/react@0.7.0-next.3

## 0.0.8-next.2

### Patch Changes

- Updated dependencies [c39ebae]
  - @latitude-data/react@0.7.0-next.2

## 0.0.8-next.1

### Patch Changes

- Updated dependencies [f8ce2e6]
  - @latitude-data/react@0.7.0-next.1

## 0.0.8-next.0

### Patch Changes

- @latitude-data/react@0.6.3-next.0

## 0.0.7

### Patch Changes

- @latitude-data/react@0.6.2

## 0.0.6

### Patch Changes

- @latitude-data/react@0.6.1

## 0.0.5

### Patch Changes

- Updated dependencies [415c307]
  - @latitude-data/react@0.6.0

## 0.0.4

### Patch Changes

- Updated dependencies [75d8495]
  - @latitude-data/react@0.5.0

## 0.0.3

### Patch Changes

- Updated dependencies [edfe2d1]
  - @latitude-data/react@0.4.0

## 0.0.2

### Patch Changes

- Updated dependencies [734e18d]
  - @latitude-data/react@0.3.0

## 0.0.1

### Patch Changes

- Updated dependencies [bbd4f8a]
  - @latitude-data/react@0.2.0
