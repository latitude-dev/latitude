import fs from 'fs'
import { spawn } from 'child_process'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { syncQueriesAndCsvs } from '.'
import syncFiles from '../shared/syncFiles'
import { APP_FOLDER, LATITUDE_FOLDER } from '$src/commands/constants'

function initPackageJson({
  folder,
  hasDependency,
}: {
  folder: string
  hasDependency: boolean
}) {
  fs.writeFileSync(
    `${folder}/package.json`,
    JSON.stringify({
      dependencies: {
        ...(hasDependency
          ? {
              '@latitude-data/postgresql-connector': '^1.0.0',
            }
          : {}),
      },
    }),
  )
}

vi.mock('../shared/syncFiles', () => ({
  default: vi.fn(),
}))

let sourceType = 'postgres'
let sourceContent = `
  type: ${sourceType}
  details:
    host: localhost
    port: 5432
    user: myuser
    password: LATITUDE__DB_PASSWORD
    database: mydatabase
`

let tmpDir: string = ''
let destinationQueriesDir: string = ''
let sync: Function
describe('syncSources', () => {
  beforeEach(() => {
    tmpDir = `/tmp/data-app-folder-${Math.random().toString(36).substring(7)}`
    fs.mkdirSync(tmpDir)
    const latitudeFolder = `${tmpDir}/${LATITUDE_FOLDER}`
    fs.mkdirSync(latitudeFolder)

    const factoryPackagePath = `${tmpDir}/${APP_FOLDER}/node_modules/@latitude-data/connector-factory`
    fs.mkdirSync(factoryPackagePath, { recursive: true })

    fs.writeFileSync(
      `${factoryPackagePath}/package.json`,
      JSON.stringify({
        peerDependencies: {
          '@latitude-data/postgresql-connector': '^2.0.0',
        },
      }),
    )

    fs.mkdirSync(`${tmpDir}/queries`)
    fs.writeFileSync(`${tmpDir}/queries/source.yml`, sourceContent)
    fs.writeFileSync(`${tmpDir}/queries/source.yaml`, sourceContent)

    destinationQueriesDir = `${tmpDir}/${APP_FOLDER}/static/queries`
    sync = syncQueriesAndCsvs({
      rootDir: tmpDir,
      destinationCsvsDir: `${tmpDir}/dest/csvs`,
      destinationQueriesDir,
    })
  })

  afterEach(() => {
    fs.rmdirSync(tmpDir, { recursive: true })
  })

  describe('when connector is already installed', () => {
    beforeEach(() => {
      initPackageJson({ folder: tmpDir, hasDependency: true })
    })

    it('sync .yaml files correctly', async () => {
      const srcPath = `${tmpDir}/queries/source.yaml`
      await sync(srcPath, 'add', true)

      expect(syncFiles).toHaveBeenCalledWith({
        srcPath,
        destPath: `${destinationQueriesDir}/source.yaml`,
        relativePath: 'source.yaml',
        type: 'add',
        ready: true,
      })
    })

    it('sync .yml files correctly', async () => {
      const srcPath = `${tmpDir}/queries/source.yml`
      await sync(srcPath, 'add', true)

      expect(syncFiles).toHaveBeenCalledWith({
        srcPath,
        destPath: `${destinationQueriesDir}/source.yml`,
        relativePath: 'source.yml',
        type: 'add',
        ready: true,
      })
    })

    it('do not init package.json', async () => {
      const srcPath = `${tmpDir}/queries/source.yml`
      await sync(srcPath, 'add', true)

      expect(spawn).not.toHaveBeenCalledWith(
        'npm',
        ['init -y'],
        expect.anything(),
      )
    })

    it('install installed version of connector found in factory', async () => {
      const srcPath = `${tmpDir}/queries/source.yml`
      await sync(srcPath, 'add', true)

      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['install', '@latitude-data/postgresql-connector@^2.0.0'],
        expect.anything(),
      )
    })
  })

  describe('When package.json does not exists', () => {
    beforeEach(() => {
      vi.mock('child_process', () => ({
        spawn: vi.fn((_, args, options) => {
          const mockChildProcess = {
            on: vi.fn((event, callback) => {
              if (args[0] === 'init' && args[1] === '-y') {
                initPackageJson({
                  folder: options.cwd,
                  hasDependency: false,
                })
              }
              if (event === 'close') {
                callback(0)
              }
            }),
          }
          return mockChildProcess
        }),
      }))
    })

    it('init package.json', async () => {
      const srcPath = `${tmpDir}/queries/source.yaml`
      await sync(srcPath, 'add', true)

      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['init', '-y'],
        expect.anything(),
      )
    })

    it('Install connector', async () => {
      const srcPath = `${tmpDir}/queries/source.yaml`
      await sync(srcPath, 'add', true)

      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['install', '@latitude-data/postgresql-connector@^2.0.0'],
        expect.anything(),
      )
    })
  })
})
