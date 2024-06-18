export default abstract class Adapter {
  abstract get(key: string): Promise<string | null>
  abstract set(key: string, value: string | Blob): Promise<void>
}
