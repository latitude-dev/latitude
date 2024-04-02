import colors from 'picocolors'
import {
  MASTER_KEY_NAME,
  createMasterKey,
  readSecret,
} from '$src/commands/credentials/createMasterKey'
import boxedMessage from '$src/lib/boxedMessage'
import { CommonCLIArgs } from '$src/types'
import tracked from '$src/lib/decorators/tracked'

enum MessageStatus {
  existing,
  missing,
  created,
  alreadyCreated,
  overwritten,
}
function displayKey({
  secret,
  status,
}: {
  secret: string | undefined
  status: MessageStatus
}) {
  const alreadyCreated = status === MessageStatus.alreadyCreated
  const messageStatus =
    status === MessageStatus.created
      ? colors.green('created')
      : alreadyCreated
        ? colors.red('already created')
        : status === MessageStatus.missing
          ? colors.red('missing')
          : status === MessageStatus.overwritten
            ? colors.yellow('overwritten')
            : colors.blue('exists')
  const secretMsg = secret
    ? `\n${colors.blue(MASTER_KEY_NAME)}=${colors.green(secret)}\n`
    : ''
  const flag = alreadyCreated ? 'overwrite-master-key' : 'create-master-key'
  const command =
    !secret || alreadyCreated
      ? `${colors.blue(
          `Run ${colors.green(`latitude credentials --${flag}`)}`,
        )}`
      : ''
  boxedMessage({
    title: 'Credentials',
    text: `Master secret key ${messageStatus}${secretMsg}\n${command}`,
    color: 'yellow',
  })
}

export type Props = CommonCLIArgs & {
  'create-master-key'?: boolean
  'overwrite-master-key'?: boolean
}

async function credentialsCommand(args: Props) {
  let secret = readSecret()
  const alreadyCreated = !!secret
  const createKey = args['create-master-key'] ?? false
  const overwriteKey = args['overwrite-master-key'] ?? false
  const writeKey = createKey || overwriteKey

  if (writeKey) {
    secret = createMasterKey({ overwriteKey })
  }

  displayKey({
    secret,
    status: overwriteKey
      ? MessageStatus.overwritten
      : createKey
        ? alreadyCreated
          ? MessageStatus.alreadyCreated
          : MessageStatus.created
        : secret
          ? MessageStatus.existing
          : MessageStatus.missing,
  })
}

export default tracked('credentialsCommand', credentialsCommand)
