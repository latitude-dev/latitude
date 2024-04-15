import { request } from '$src/lib/server'
import chalk from 'chalk'

export default function pokeCommand() {
  request({ path: '/api/users/me' }, async ({ err, res }) => {
    if (err) {
      console.error(chalk.red(err.message))
      process.exit(1)
    } else {
      const { response, responseBody } = res

      if (response.statusCode === 200) {
        console.log(chalk.green('Server is up and running'))
      } else if (response.statusCode === 401) {
        const { error } = await JSON.parse(responseBody)
        console.error(chalk.red(error))
        process.exit(1)
      } else {
        console.error(
          chalk.red(
            'Server responded with an error status code: ',
            response.statusCode,
          ),
        )
        process.exit(1)
      }
    }
  })
}
