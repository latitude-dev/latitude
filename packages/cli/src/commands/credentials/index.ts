import crypto from 'crypto'
import tracked from '$src/lib/decorators/tracked'
import setup from '$src/lib/decorators/setup'
import setRootDir from '$src/lib/decorators/setRootDir'

async function credentialsCommand() {
  const masterKey = crypto.randomBytes(64).toString('hex')

  console.log(`LATITUDE_MASTER_KEY=${masterKey}`)
}

export default tracked(
  'credentialsCommand',
  setRootDir(setup(credentialsCommand)),
)
