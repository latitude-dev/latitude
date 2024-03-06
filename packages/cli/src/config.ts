class CLIConfig {
  private static instance: CLIConfig
  private _debug: boolean = false
  private _dev: boolean = false
  private _pro: boolean = true
  private _simulatedPro: boolean = false

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

  get simulatedPro(): boolean {
    return this._simulatedPro
  }

  setDev({ dev, args }: { dev: boolean; args: string[] }) {
    const simulatedPro = this.isSimulatedPro(args)
    this._dev = dev
    this._simulatedPro = simulatedPro
    this._pro = !this._dev
  }

  get debug(): boolean {
    return this._debug
  }

  set debug(args: string[]) {
    if (Array.isArray(args)) {
      this._debug = !!(args[0] as unknown as { debug?: boolean })?.debug
    }
  }

  private isSimulatedPro(args: string[]): boolean {
    if (!Array.isArray(args)) return false

    return !!(args[0] as unknown as { 'simulate-pro': boolean })?.[
      'simulate-pro'
    ]
  }
}

export default CLIConfig.getInstance()
