import * as vscode from 'vscode';
import { getProjectSource } from '../../utils/project';
import { checkForLatitudeCli } from '../../utils/checkForLatitudeCli';

export default async function dev() {
  if (!vscode.workspace.workspaceFolders?.length && !vscode.window.activeTextEditor) {
    vscode.window.showErrorMessage('Could not find Latitude project to start dev server');
    return;
  }

  let sourceDir = undefined;

  // Find the Latitude project the open file belongs to
  const activeFile = vscode.window.activeTextEditor?.document;
  if (activeFile) {
    sourceDir = getProjectSource(activeFile.uri);
  }

  // Find a Latitude project in the workspace root
  const workspaces = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) || [];
  while (!sourceDir && workspaces.length) {
    sourceDir = getProjectSource(vscode.Uri.file(workspaces.pop()!));
  }
  
  if (!sourceDir) {
    vscode.window.showErrorMessage(`Could not find Latitude project to start dev server`);
    return;
  }

  if (!checkForLatitudeCli()) return;
  vscode.window.showInformationMessage(`Starting Latitude dev server in ${sourceDir}`);

  const terminal = vscode.window.createTerminal('Latitude server');
  terminal.sendText(`cd ${sourceDir}`);
  terminal.sendText(`latitude dev`);
  terminal.show();
}