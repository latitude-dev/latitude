import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

export function getProjectSource(fileUri: vscode.Uri): string | undefined {
  const file = fileUri.fsPath
  const directory = fs.lstatSync(file).isDirectory() ? file : path.dirname(file)
  const latitudeConfigFile = path.join(directory, 'latitude.json')

  if (fs.existsSync(latitudeConfigFile)) {
    return directory
  }

  const parentDirectory = path.dirname(directory)
  if (parentDirectory === '/') {
    return undefined
  }
  return getProjectSource(vscode.Uri.file(parentDirectory))
}
