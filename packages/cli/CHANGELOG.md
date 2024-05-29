# @latitude-data/cli

## 1.7.0-next.0

### Minor Changes

- f8406cf: latitude.json is now copied and updated into the .latitude/app folder of the project
- bd39d29: Add materialize command to latitude CLI
- 5388504: Pass Source to connectors to get access to source details and also to source manager
  This is a breaking change. Before connectors were receiving `rootPath` of their
  queries and now this info is obta1ined from the source.

### Patch Changes

- Updated dependencies [9e2dd26]
- Updated dependencies [bd39d29]
- Updated dependencies [aab4a4e]
- Updated dependencies [b95b26d]
- Updated dependencies [26aa69d]
- Updated dependencies [5388504]
- Updated dependencies [a8d4658]
  - @latitude-data/source-manager@1.0.0-next.0

## 1.6.0

### Minor Changes

- 25c614f: Add the ability of adding secure environment variables to Latitude Cloud
- 25c614f: Allow adding multiple secrets at the same time to Latitude Cloud
- 25c614f: Only generate LATITUDE_MASTER_KEY with the CLI. Do not include in the build. This improve security

## 1.5.0

### Minor Changes

- 5a6a5d2: Adds next flag to update and start commands
- 9d1aa7d: Added signup/login message when attempting deploy unauthorized

## 1.4.0

### Minor Changes

- 7ba4dfe: Little GitHub stars banner in deploy and start commands in CLI

## 1.3.3

### Patch Changes

- bda631b: Do not include prerelease versions in CLI options

## 1.3.2

### Patch Changes

- Updated dependencies [61916ed]
  - @latitude-data/source-manager@0.1.1

## 1.3.1

### Patch Changes

- 48662c6: Add cli version to dockerfile

## 1.3.0

### Minor Changes

- f26cbe3: Added command to create latitude cloud tokens
- 51c3d29: Unify and call app parameter always app on cloud CLI commands

### Patch Changes

- 8e0ed89: Update npm dependencies on latitude update
  add --force flag to latitude update in order to override docker files

## 1.2.0

### Minor Changes

- ed76f6d: Read latitude cloud auth token from env var first

## 1.1.0

### Minor Changes

- bfdcfeb: Instead of passing email as argument to the cli when doing signup or login ask users when they run these commands
- 43179d6: Now query behaviour can be configured either in the source config file or the query themselves by adding a custom keyword. The first available option is `ttl`, that defines the cached lifetime of the query results in the server, before having to be refetched again.
- ffaa618: CLI now handles all docker-related configuration for the user, so we no longer rely on the templates being up to date in this regard.

### Patch Changes

- Updated dependencies [43179d6]
  - @latitude-data/source-manager@0.1.0

## 1.0.1

### Patch Changes

- f04793e: Fix: connectors were still being installed in latitude apps by default
- Updated dependencies [f04793e]
  - @latitude-data/connector-factory@1.0.1

## 1.0.0

### Major Changes

- e97b521: BREAKING CHANGE

  This commit changes the way connectors are installed in Latitude projects.

  Before this release, all connectors were getting bundled by default in
  production builds, greatly increasing their size and impacting install times.
  From now on, connectors are opt-in. The CLI will automatically detect all
  sources configured in .yml files and install only the necessary dependencies.

  This change also affects development watchers, which will install connectors as
  the developer adds them. However, it is the responsability of the developers
  to uninstall any unused connectors, if a particular source is removed.

### Minor Changes

- e85196b: Implements the first commands to interact with the Latitude PaaS. Specifically:

  - latitude signup: To signup to latitude from the CLI
  - latitude login: To login to your existing account
  - latitude logout: To logout from your existing account
  - latitude deploy: To deploy your application to the Latitude PaaS
  - latitude destroy: To destroy your application from the Latitude PaaS
  - latitude cancel: To cancel an ongoing deployment to the Latitude PaaS

### Patch Changes

- 17b7dc1: New template name
- Updated dependencies [e97b521]
  - @latitude-data/connector-factory@1.0.0

## 0.8.2

### Patch Changes

- fa50966: fix: static files sync is breaking production builds

## 0.8.1

### Patch Changes

- 943cd56: Server was opening with the wrong port if the original port is busy.

## 0.8.0

### Minor Changes

- b735b23: Support for static files in views. Just add any file inside the `views` folder, and they will be accessible in your web app.
- 2b31b14: Feature: CLI run command now allows using a --debug tag to see the compiled query
- a2d0427: Fix CLI build command failing when views folder doesn't exists

## 0.7.1

### Patch Changes

- 3094cb7: Manage client connection instance to allow running multiple queries in the same request.

## 0.7.0

### Minor Changes

- bc90dba: allow users to run CLI from project subfolders
- 3e4f9ec: Added pre step to check we are in a latitude project when running a CLI command
- 7b32cc4: Add Sentry to CLI to track errors better

### Patch Changes

- 02fcca9: Fix: CLI run command was ignoring --watch flag.

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
