class CLIConfig {
  private static instance: CLIConfig
  private _debug: boolean = false
  private _dev: boolean = false
  private _pro: boolean = true

  private constructor() {}
  public static getInstance(): CLIConfig {
    if (CLIConfig.instance) return this.instance

    this.instance = new CLIConfig()
    return this.instance
  }

  get dev(): boolean {
    return this._dev
  }

  get pro(): boolean {
    return this._pro
  }

  set dev(dev: boolean) {
    this._dev = dev
    this._pro = !dev
  }

  get debug(): boolean {
    return this._debug
  }

  set debug(args: string[]) {
    if (Array.isArray(args)) {
      this._debug = !!(args[0] as unknown as { debug?: boolean }).debug
    }
  }
}

export default CLIConfig.getInstance()
