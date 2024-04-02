import * as vscode from 'vscode';

export async function openFile(path: string): Promise<vscode.TextDocument> {
  const worspaceDirectory = vscode.workspace.workspaceFolders?.[0]!.uri.fsPath;
  const document = await vscode.workspace.openTextDocument(`${worspaceDirectory}/${path}`);
  await vscode.window.showTextDocument(document);
  return document;
}

export async function closeAllOpenFiles() {
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');
}