# @latitude-data/cli

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
