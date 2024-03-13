import sync from '$src/lib/sync'
import syncDotenv from '$src/lib/sync/syncDotenv'

export default async function prepareCommand() {
  return Promise.all([sync(), syncDotenv()])
}
