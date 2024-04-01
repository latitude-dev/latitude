# @latitude-data/cli

## 0.6.0

### Minor Changes

- 8bfd41a: added setup command

### Patch Changes

- 6cbfd9b: fix: misleading telemetry command log

## 0.5.0

### Minor Changes

- 37b9c34: Fix template selector not shown when starting a project

## 0.4.0

### Minor Changes

- 740af6a: Remove pkgManager abstraction and always show npm install progress
- f646207: Fix telemetry double question when starting a project and add test suite for Telemetry module

### Patch Changes

- edca3cc: General UX improvements and some minor bugfixes
- 6dd4293: Reduce the number of boxed messages the CLI displays
- 3bf61f7: Implements docker support with regular `docker build` command. Removes `--docker` flag from `latitude build` command.
- 6e6b4ca: Adds warning about deprecation of `prepare` command

## 0.3.0

### Minor Changes

- c38974c: Adds a prompt to update the cli if there is a new version available. It does it once per day.
- 6f4d4fe: CLI package can now be used to sync project files programmatically
- 3254d59: - Signed params. Allow users to sign params so they can be send encrypted to latitude server. This is helpful for embedding latitude in a client side application in a iframe
  - Fix bug related with `__force` param not being interpreted correctly because
    it was sent as `$text:true` instead of `true` so query was not recomputed

### Patch Changes

- 2ddf668: Minor UX changes and added e2e tests
- 0a12f25: fix: do not hard crash when npm view process outputs to stderr

## 0.2.3

### Patch Changes

- 1331e27: fix: fixes related to the syncing of dependencies breaking when a package.json is not present, or present and malformed

## 0.2.2

### Patch Changes

- 3ea6ae1: hotfix: resolve promise in watch mode of syncDependencies

## 0.2.1

### Patch Changes

- 0c9befc: hotfix: defend against package.json not existing in watch mode

## 0.2.0

### Minor Changes

- 85d57e2: CLI (minor): Allow users to install custom npm dependencies to their Latitude projects with regular npm install
  Connectors factory (patch): Raise an error if user tries to use a secret environment variable that we cannot find in the environment.

## 0.1.2

### Patch Changes

- 59b5528: Ignore CLI spawn process warnings

## 0.1.1

### Patch Changes

- c86e7b9: fix: .env syncing throwing an error when .env does not exist
  fix: properly exit when user tells us to and directory is not empty
  (BREAKING) major: changed latitude.json default attribute names for more sensible ones

## 0.1.0

### Minor Changes

- Public release 0.1.0 🎉

## 0.0.29

### Patch Changes

- Add telemetry to CLI

## 0.0.28

### Patch Changes

- Minor fixes

## 0.0.27

### Patch Changes

- 75914ef: Fixed server closing on port conflict.

## 0.0.26

### Patch Changes

- add .env syncing for build production

## 0.0.25

### Patch Changes

- 66b9bec: New `latitude run` CLI command

## 0.0.24

### Patch Changes

- - Adds the `latitude prepare` command to the cli
  - Adds --docker flag to `latitude build` command

## 0.0.23

### Patch Changes

- Check node environment at runtime not at build time in the CLI

## 0.0.22

### Patch Changes

- 1bb3a5c: Fix issues related with the CLI build. Now is build in esm

## 0.0.21

### Patch Changes

- minor: improve cli's build command with easier access to the production build

## 0.0.20

### Patch Changes

- 586e9a3: Create latitude.json configuration file and manage app version

## 0.0.19

### Patch Changes

- 586e9a3: Create latitude.json configuration file and manage app version

## 0.0.18

### Patch Changes

- Forgot to build (again)

## 0.0.17

### Patch Changes

- fix: added missing default app version to some latitude commands

## 0.0.16

### Patch Changes

- Added missing default app version to latitude start command

## 0.0.15

### Patch Changes

- We forgot to build the packages before release :facepalm:

## 0.0.14

### Patch Changes

- ef78e3e: Add build command to build the production version of Latitude
- 485a3cf: - When cloning a data project repo auto install latitude app when running dev command
  - Implement `latitude update --app-version` so users can updgrade/downgrade

## 0.0.13

### Patch Changes

- build all packages before release

## 0.0.12

### Patch Changes

- - Implements syncing of csvs #21b51bc

## 0.0.11

### Patch Changes

- 8daa229: Improve dev experience inside monorepo

## 0.0.10

### Patch Changes

- we forgot to built the cli in prod mode

## 0.0.9

### Patch Changes

- - View component is columnar by default now
  - Improved Table blank slate with proper loading indicators

## 0.0.8

### Patch Changes

- Fix autoimports by adding missing components

## 0.0.7

### Patch Changes

- I forgot to build the CLI package

## 0.0.6

### Patch Changes

- Fix dependency installation by passing the right CWD (current working directory)

## 0.0.5

### Patch Changes

- Fix app folder where npm install happens

## 0.0.4

### Patch Changes

- Use exec instead of spawn for running npm install

## 0.0.3

### Patch Changes

- - Build CLI in production mode.
  - Add error handler to npm install to see what fails

## 0.0.2

### Patch Changes

- 0b5047a: Download data app server package from NPM

## 0.0.1

### Patch Changes

- First published release of Latitude data!
