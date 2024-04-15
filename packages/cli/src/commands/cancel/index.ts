import loggedIn from '$src/lib/decorators/loggedIn'
import tracked from '$src/lib/decorators/tracked'
import findConfigFile from '$src/lib/latitudeConfig/findConfigFile'
import { request } from '$src/lib/server'
import chalk from 'chalk'

function cancel() {
  const latitudeJson = findConfigFile()
  const name = latitudeJson.data.name

  console.log(chalk.gray(`Cancelling deploy of ${name}...`))

  request(
    {
      method: 'POST',
      path: '/api/apps/cancel',
      data: JSON.stringify({ app: name }),
    },
    ({ err, res }) => {
      if (err) {
        console.error(chalk.red('Failed to cancel deploy:', err.message))

        process.exit(1)
      } else {
        const { response } = res

        if (response.statusCode === 200) {
          console.log(chalk.green('Deploy cancelled.'))
        } else {
          console.error(
            chalk.red('Failed to cancel deploy:', response.statusMessage),
          )

          process.exit(1)
        }
      }
    },
  )
}

export default tracked('cancelCommand', loggedIn(cancel))
