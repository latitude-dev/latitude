import * as vscode from 'vscode'
import * as path from 'path'
import { getProjectSource } from '../../utils/project'
import { checkForLatitudeCli } from '../../utils/checkForLatitudeCli'

export default async function run(watch: boolean = false) {
  const activeFile = vscode.window.activeTextEditor?.document
  if (!activeFile || activeFile?.languageId !== 'latitudeSql') {
    vscode.window.showErrorMessage(
      `Could not run query: File is not a Latitude query.`,
    )
    return
  }

  const sourceDir = getProjectSource(activeFile!.uri)
  if (!sourceDir) {
    vscode.window.showErrorMessage(
      `Could not find Latitude project source directory.`,
    )
    return
  }

  if (!checkForLatitudeCli()) return

  const queriesDir = path.join(sourceDir!, 'queries')
  const relativePath = path
    .relative(queriesDir, activeFile!.uri.fsPath)
    .replace(/\.sql$/, '')

  const terminal = vscode.window.createTerminal(
    `Latitude query: ${relativePath}`,
  )
  terminal.sendText(`cd ${sourceDir}`)
  terminal.sendText(`latitude run ${relativePath} ${watch ? '--watch' : ''}`)
  terminal.show()
}
