import { describe, it } from 'mocha'
import * as vscode from 'vscode'

export default async function run() {
  const { assert } = await import('chai')

  describe('Start server command', function () {
    it('exists latitude.dev', async () => {
      const commandId = 'latitude.dev'
      const command = await vscode.commands.getCommands()
      assert.include(command, commandId)
    })
  })
}
