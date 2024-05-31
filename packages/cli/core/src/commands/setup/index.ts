import setup from '$src/lib/decorators/setup'
import tracked from '$src/lib/decorators/tracked'

function SetupCommand() {
  process.exit()
}

export default tracked('setupCommand', setup(SetupCommand))
