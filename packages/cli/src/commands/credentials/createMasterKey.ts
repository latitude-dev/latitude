import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import config from '$src/config'
import syncDotenv from '$src/lib/sync/syncDotenv'

export const MASTER_KEY_NAME = 'LATITUDE_MASTER_KEY'

function readEnvFile() {
  const filePath = path.join(config.rootDir, '.env')
  const envExists = fs.existsSync(filePath)
  const content = envExists ? fs.readFileSync(filePath, 'utf8') : ''
  return { content, filePath }
}

function writeSecret({
  writeCallback,
}: {
  writeCallback: (secretLine: string, envContent: string) => string
}) {
  const { content, filePath } = readEnvFile()
  const JWTSecret = crypto.randomBytes(64).toString('hex')
  const secretLine = `${MASTER_KEY_NAME}=${JWTSecret}`
  const envContent = writeCallback(secretLine, content)

  fs.writeFileSync(filePath, envContent, 'utf8')

  syncDotenv()

  return JWTSecret
}

function createSecret() {
  return writeSecret({
    writeCallback: (secretLine: string, envContent: string) => {
      envContent += `\n${secretLine}\n`
      return envContent
    },
  })
}

function isMasterKeyLine(line: string) {
  return line.trim().startsWith(MASTER_KEY_NAME)
}

function overwriteSecret() {
  return writeSecret({
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

export function readSecret(): string | undefined {
  const { content } = readEnvFile()
  const existingSecret = content
    .split('\n')
    .find((line) => line.startsWith(`${MASTER_KEY_NAME}=`))

  if (!existingSecret) return undefined

  // pick the part after the '=' sign
  return existingSecret.split('=')[1]
}

export function createMasterKey(
  {
    overwriteKey = false,
  }: {
    overwriteKey?: boolean
  } = { overwriteKey: false },
) {
  let secret = readSecret()

  if (!secret && !overwriteKey) {
    secret = createSecret()
  } else if (overwriteKey) {
    secret = overwriteSecret()
  }

  return secret
}
