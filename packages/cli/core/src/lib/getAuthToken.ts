import configStore from './configStore'

export default function getAuthToken() {
  return process.env.LATITUDE_TOKEN || configStore.get('jwt')
}
