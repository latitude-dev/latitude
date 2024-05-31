import fs from 'fs'
import syncFiles from '../shared/syncFiles'
import { APP_FOLDER, LATITUDE_FOLDER } from '$src/commands/constants'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { syncQueriesAndCsvs } from '.'
import config from '$src/config'

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
              '@latitude-data/test-connector': '^1.0.0',
            }
          : {}),
      },
    }),
  )
}

vi.mock('../shared/syncFiles', async () => {
  const actualSyncFiles = await vi.importActual('../shared/syncFiles')
  const def = actualSyncFiles.default as typeof syncFiles
  return {
    default: vi.fn(def),
  }
})

vi.mock('$/config', () => ({
  default: { rootDir: vi.fn() },
}))

let sourceType = 'test'
let sourceContent = `
  type: ${sourceType}
  details:
    host: localhost
    port: 5432
    user: myuser
    password: mypassword
    database: mydatabase
`

let tmpDir: string = ''
let destinationQueriesDir: string = ''
let sync: Function
describe('syncSources', () => {
  beforeEach(async () => {
    tmpDir = `/tmp/data-app-folder-${Math.random().toString(36).substring(7)}`
    vi.mocked(config).rootDir = tmpDir
    fs.mkdirSync(tmpDir)
    const latitudeFolder = `${tmpDir}/${LATITUDE_FOLDER}`
    fs.mkdirSync(latitudeFolder)

    const factoryPackagePath = `${tmpDir}/${APP_FOLDER}/node_modules/@latitude-data/connector-factory`
    fs.mkdirSync(factoryPackagePath, { recursive: true })

    fs.writeFileSync(
      `${factoryPackagePath}/package.json`,
      JSON.stringify({
        peerDependencies: {
          '@latitude-data/test-connector': '^2.0.0',
        },
      }),
    )

    fs.mkdirSync(`${tmpDir}/queries`)
    fs.writeFileSync(`${tmpDir}/queries/source.yml`, sourceContent)
    fs.writeFileSync(`${tmpDir}/queries/source.yaml`, sourceContent)

    destinationQueriesDir = `${tmpDir}/${APP_FOLDER}/static/.latitude/queries`
    sync = syncQueriesAndCsvs({
      destinationCsvsDir: `${tmpDir}/dest/csvs`,
      destinationQueriesDir,
    })
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true })
  })

  describe('when connector is already installed', () => {
    beforeEach(() => {
      initPackageJson({ folder: tmpDir, hasDependency: true })
      fs.mkdirSync(`${tmpDir}/node_modules/@latitude-data/test-connector`, {
        recursive: true,
      })
    })

    afterEach(() => {
      fs.rmSync(`${tmpDir}/node_modules/@latitude-data/test-connector`, {
        recursive: true,
      })
    })

    it('syncs .yaml files correctly', async () => {
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

    it('syncs .yml files correctly', async () => {
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
  })
})
