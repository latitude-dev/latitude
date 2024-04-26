import tracked from '$src/lib/decorators/tracked'
import { request } from '$src/lib/server'
import chalk from 'chalk'

async function createToken() {
  const { token } = await request({
    method: 'GET',
    path: '/api/users/token',
  })
    .then(({ body }) => JSON.parse(body))
    .catch((err) => {
      console.error(chalk.red('Failed to create token:', err.message))

      process.exit(1)
    })

  console.log(`
${chalk.bold('Token generated:')}

${token}
`)
}

export default tracked('createTokenCommand', createToken)
