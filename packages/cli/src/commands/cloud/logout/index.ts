import configStore from '$src/lib/configStore'

export default function logoutCommand() {
  configStore.set('jwt', undefined)

  console.log('Logged out successfully. See you soon!')
}
