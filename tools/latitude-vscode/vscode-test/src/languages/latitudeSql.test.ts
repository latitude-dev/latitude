import { afterEach, describe, it } from 'mocha'
import { closeAllOpenFiles, openFile } from '../lib/files'

export default async function run() {
  const { assert } = await import('chai')

  describe('LatitudeSql', function () {
    afterEach(async () => {
      await closeAllOpenFiles()
    })

    it('Recognizes the SQL file as LatitudeSql when latitude.json is present', async () => {
      const document = await openFile('latitudeProject/queries/sample.sql')
      const languageId = document.languageId
      assert.equal(languageId, 'latitudeSql')
    })

    it('Does not recognize the SQL file as LatitudeSql when latitude.json is not present', async () => {
      const document = await openFile('notLatitudeProject/queries/sample.sql')
      const languageId = document.languageId
      assert.notEqual(languageId, 'latitudeSql')
      assert.equal(languageId, 'sql')
    })
  })
}
