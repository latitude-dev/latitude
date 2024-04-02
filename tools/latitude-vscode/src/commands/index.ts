import * as vscode from 'vscode'
import dev from './dev'
import run from './run'

export function activate(context: vscode.ExtensionContext) {
  function registerCommand(command: string, callback: (...args: any[]) => any) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, callback),
    )
  }

  registerCommand('latitude.dev', dev)
  registerCommand('latitude.run', () => run(false))
  registerCommand('latitude.runWatch', () => run(true))
}
