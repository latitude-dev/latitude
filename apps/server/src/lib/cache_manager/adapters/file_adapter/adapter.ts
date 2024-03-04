export default abstract class Adapter {
  abstract get(key: string): string | null
  abstract set(key: string, value: string | Blob): void
}
