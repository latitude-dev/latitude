import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { CLIConfig } from '$src/config'
import syncDotenv from '$src/lib/sync/syncDotenv'

export const MASTER_KEY_NAME = 'LATITUDE_MASTER_KEY'

function readEnvFile({ config }: { config: CLIConfig }) {
  const filePath = path.join(config.source, '.env')
  const envExists = fs.existsSync(filePath)
  const content = envExists ? fs.readFileSync(filePath, 'utf8') : ''
  return { content, filePath }
}

function writeSecret({
  config,
  writeCallback,
}: {
  config: CLIConfig
  writeCallback: (secretLine: string, envContent: string) => string
}) {
  const { content, filePath } = readEnvFile({ config })
  const JWTSecret = crypto.randomBytes(64).toString('hex')
  const secretLine = `${MASTER_KEY_NAME}=${JWTSecret}`
  const envContent = writeCallback(secretLine, content)

  fs.writeFileSync(filePath, envContent, 'utf8')
  syncDotenv({ config })

  return JWTSecret
}

function createSecret({ config }: { config: CLIConfig }) {
  return writeSecret({
    config,
    writeCallback: (secretLine: string, envContent: string) => {
      envContent += `\n${secretLine}\n`
      return envContent
    },
  })
}

function isMasterKeyLine(line: string) {
  return line.trim().startsWith(MASTER_KEY_NAME)
}

function overwriteSecret({ config }: { config: CLIConfig }) {
  return writeSecret({
    config,
    writeCallback: (secretLine: string, envContent: string) => {
      const lines = envContent.split(/\r?\n/)
      const indices = lines
        .map((line, index) => (isMasterKeyLine(line) ? index : -1))
        .filter((index) => index !== -1)

      const lastOccurrenceIndex = lines
        .map((line, index) => (isMasterKeyLine(line) ? index : -1))
        .lastIndexOf(Math.max(...indices))

      return lines
        .map((line, index) => {
          if (index === lastOccurrenceIndex) {
            return secretLine
          } else if (isMasterKeyLine(line)) {
            return null
          }

          return line
        })
        .filter((line) => line !== null)
        .join('\n')
    },
  })
}

export function readSecret({
  config,
}: {
  config: CLIConfig
}): string | undefined {
  const { content } = readEnvFile({ config })
  const existingSecret = content
    .split('\n')
    .find((line) => line.startsWith(`${MASTER_KEY_NAME}=`))

  if (!existingSecret) return undefined

  // pick the part after the '=' sign
  return existingSecret.split('=')[1]
}

export function createMasterKey({
  config,
  overwriteKey = false,
}: {
  config: CLIConfig
  overwriteKey?: boolean
}) {
  let secret = readSecret({ config })

  if (!secret && !overwriteKey) {
    secret = createSecret({ config })
  } else if (overwriteKey) {
    secret = overwriteSecret({ config })
  }

  return secret
}
