import { describe, it } from 'mocha'
import runLanguageTests from './languages/index.test'
import runCommandsTests from './commands/index.test'
import * as vscode from 'vscode'

export default async function run() {
  const { assert } = await import('chai')

  describe('Extension configuration', function () {
    it('Imports the extension', async () => {
      const extension = vscode.extensions.getExtension(
        'LatitudeData.latitude-vscode',
      )
      const fakeExtension = vscode.extensions.getExtension(
        'LatitudeData.latitude-vscode-fake',
      )
      assert.exists(extension)
      assert.notExists(fakeExtension)
    })

    it("Activates the extension when there's a latitude.json file in the workspace", async () => {
      const extension = vscode.extensions.getExtension(
        'LatitudeData.latitude-vscode',
      )
      assert.isTrue(extension?.isActive)
    })
  })

  runLanguageTests()
  runCommandsTests()
}

run()
