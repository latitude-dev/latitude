import * as vscode from 'vscode'
import { getProjectSource } from '../utils/project'

const CUSTOM_LANGUAGES: Record<string, string[]> = {
  latitudeHtml: ['html', 'svelte'],
  latitudeSql: ['sql'],
}

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.textDocuments.forEach(checkAndSetLanguage)

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(async (document) => {
      checkAndSetLanguage(document)
    }),
  )
}

function checkAndSetLanguage(document: vscode.TextDocument) {
  Object.keys(CUSTOM_LANGUAGES).forEach(async (customId: string) => {
    if (CUSTOM_LANGUAGES[customId]?.includes(document.languageId)) {
      if (getProjectSource(document.uri) !== undefined) {
        await vscode.languages.setTextDocumentLanguage(document, customId)
      }
    }
  })
}
