export default class Scope {
  private consts: Record<string, number> = {}
  private vars: Record<string, number> = {}

  constructor(
    private readFromStash: (index: number) => unknown,
    private addToStash: (value: unknown) => number,
    private modifyStash: (index: number, value: unknown) => void,
  ) {}

  exists(name: string): boolean {
    return name in this.consts || name in this.vars
  }

  isConst(name: string): boolean {
    return name in this.consts
  }

  get(name: string): unknown {
    const index = this.consts[name] ?? this.vars[name] ?? undefined
    if (index === undefined) throw new Error(`Variable ${name} does not exist`)
    return this.readFromStash(index)
  }

  defineConst(name: string, value: unknown): void {
    if (this.exists(name)) throw new Error(`Variable ${name} already exists`)
    this.consts[name] = this.addToStash(value)
  }

  set(name: string, value: unknown): void {
    if (this.isConst(name)) throw new Error(`Variable ${name} is a constant`)
    if (!this.exists(name)) {
      this.vars[name] = this.addToStash(value)
      return
    }
    const index = this.vars[name]!
    this.modifyStash(index, value)
  }

  copy(): Scope {
    const scope = new Scope(
      this.readFromStash,
      this.addToStash,
      this.modifyStash,
    )
    scope.consts = { ...this.consts }
    scope.vars = { ...this.vars }
    return scope
  }
}