import { afterEach, describe, it } from 'mocha'
import { closeAllOpenFiles, openFile } from '../lib/files'

export default async function run() {
  const { assert } = await import('chai')

  describe('LatitudeHtml', function () {
    afterEach(async () => {
      await closeAllOpenFiles()
    })

    it('Recognizes the HTML file as LatitudeHtml when latitude.json is present', async () => {
      const document = await openFile('latitudeProject/views/index.html')
      const languageId = document.languageId
      assert.equal(languageId, 'latitudeHtml')
    })

    it('Does not recognize the HTML file as LatitudeHtml when latitude.json is not present', async () => {
      const document = await openFile('notLatitudeProject/views/index.html')
      const languageId = document.languageId
      assert.notEqual(languageId, 'latitudeHtml')
      assert.equal(languageId, 'html')
    })
  })
}
