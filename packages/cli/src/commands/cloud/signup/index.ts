import askEmail from '$src/commands/cloud/lib/askEmail'
import askPassword from '$src/commands/cloud/lib/askPassword'
import boxedMessage from '$src/lib/boxedMessage'
import configStore from '$src/lib/configStore'
import { request } from '$src/lib/server'
import chalk from 'chalk'

export default async function signupCommand() {
  const email = await askEmail()
  const options = {
    path: '/auth/signup',
    method: 'POST',
    data: JSON.stringify({
      email,
      password: await askPassword(),
    }),
  }

  const { token } = await request(options)
    .then(({ body }) => JSON.parse(body))
    .catch((err) => {
      if (err.status === 403) {
        boxedMessage({
          title: 'Latitude PaaS Beta Access',
          color: 'yellow',
          text: `
You are on the waitlist for ${chalk.bold(
            'Latitude Cloud',
          )}. If you want early access, please request it from our community Slack channel or via email:

-> Slack: https://join.slack.com/t/trylatitude/shared_invite/zt-17dyj4elt-rwM~h2OorAA3NtgmibhnLA
-> Email: hello@latitude.so
`,
        })

        process.exit()
      } else {
        console.error(chalk.red('Signup request failed:', err.message))

        process.exit(1)
      }
    })

  configStore.set('jwt', token)
  console.log(chalk.green(`Signed up successfully as ${email}`))
}
