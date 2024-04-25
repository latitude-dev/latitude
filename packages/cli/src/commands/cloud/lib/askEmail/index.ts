import { input } from '@inquirer/prompts'

export default async function askEmail() {
  return await input({ message: 'Enter your email' })
}
