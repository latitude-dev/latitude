import setup from '$src/lib/decorators/setup'
import tracked from '$src/lib/decorators/tracked'

async function setupCommand() {
  // Do nothing because the whole work is done in the setup decorator 👇

  process.exit()
}

export default tracked('setupCommand', setup(setupCommand))
