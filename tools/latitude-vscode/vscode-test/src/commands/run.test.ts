import { describe, it } from 'mocha'
import * as vscode from 'vscode'

export default async function run() {
  const { assert } = await import('chai')

  describe('Run query command', function () {
    it('exists latitude.run', async () => {
      const commandId = 'latitude.run'
      const command = await vscode.commands.getCommands()
      assert.include(command, commandId)
    })

    it('exists latitude.runWatch', async () => {
      const commandId = 'latitude.runWatch'
      const command = await vscode.commands.getCommands()
      assert.include(command, commandId)
    })
  })
}
