export default function counter() {
  let interval: NodeJS.Timeout
  let callback: (diff: Date) => void

  const end = () => {
    if (interval) clearInterval(interval)
  }

  const start = () => {
    const then = new Date()
    const message = 'Deploying...'
    console.log(message + ' ' + '00:00')

    interval = setInterval(() => {
      const now = new Date()
      const timeDiff = new Date(now.getTime() - then.getTime())

      if (callback) callback(timeDiff)
    }, 1000)
  }

  const tick = (cb: (diff: Date) => void) => {
    callback = cb
  }

  return {
    end,
    start,
    tick,
  }
}
