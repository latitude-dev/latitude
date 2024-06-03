export function formatElapsedTime(ms: number) {
  const rawSeconds = ms / 1000
  const minutes = Math.floor(rawSeconds / 60)
  const seconds = Math.floor(rawSeconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}
