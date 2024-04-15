import { request } from '$src/lib/server'
import chalk from 'chalk'

export default function loggedIn(commandFn: Function) {
  return async function (...args: any[]) {
    request({ path: '/api/users/me' }, ({ err, res }) => {
      if (err) {
        console.error(
          chalk.red(
            'There was an error authenticating your account. Please try again.',
          ),
        )
      } else {
        const { response } = res
        if (response.statusCode !== 200) {
          console.error(chalk.red('You are not logged in. Please login first.'))
          process.exit(1)
        }

        commandFn(...args)
      }
    })
  }
}
