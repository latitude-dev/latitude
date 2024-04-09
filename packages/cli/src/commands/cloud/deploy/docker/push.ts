import { spawn } from 'child_process'

export default async function pushDockerImage({
  username,
  password,
  url,
  tags,
}: {
  username: string
  password: string
  url: string
  tags: [string]
}) {
  return new Promise<string>((resolve, reject) => {
    const login = spawn('docker', [
      'login',
      '--username',
      username,
      '--password-stdin',
      url,
    ])

    login?.stdin?.write(password)
    login?.stdin?.end()

    login.on('close', (code) => {
      if (code === 0) {
        const push = spawn('docker', ['push', tags[0]], {
          stdio: 'inherit',
        })

        push.on('close', (code) => {
          if (code === 0) {
            const inspect = spawn('docker', ['inspect', tags[0]], {
              stdio: 'pipe',
            })

            let digest: string
            inspect.stdout.on('data', (data) => {
              const image = JSON.parse(data.toString().trim())
              digest = image[0].RepoDigests[0].split('@')[1]
            })

            inspect.on('close', (code) => {
              if (code === 0) {
                resolve(digest)
              } else {
                reject(new Error(`inspect process exited with code ${code}`))
              }
            })
          } else {
            reject(new Error(`push process exited with code ${code}`))
          }
        })
      } else {
        reject(new Error('docker login failed'))
      }
    })
  })
}
