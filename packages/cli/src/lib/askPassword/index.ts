import { password } from '@inquirer/prompts'

export default async function askPassword() {
  return await password({ message: 'Enter your password' })
}
