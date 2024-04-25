import askEmail from '$src/commands/cloud/lib/askEmail'
import askPassword from '$src/commands/cloud/lib/askPassword'
import configStore from '$src/lib/configStore'
import { request } from '$src/lib/server'
import chalk from 'chalk'

export default async function loginCommand() {
  const email = await askEmail()
  const options = {
    path: '/auth/login',
    method: 'POST',
    data: JSON.stringify({
      email,
      password: await askPassword(),
    }),
  }

  const { token } = await request(options)
    .then(({ body }) => JSON.parse(body))
    .catch((err) => {
      console.error(chalk.red('Login request failed:', err.message))

      process.exit(1)
    })

  configStore.set('jwt', token)
  console.log(chalk.green(`Logged in successfully as ${email}`))
}
