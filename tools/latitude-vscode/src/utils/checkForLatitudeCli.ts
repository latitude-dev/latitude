import { execSync } from 'child_process';
import * as vscode from 'vscode';

export function checkForLatitudeCli(): boolean {
  try {
    const output = execSync('npm list -g @latitude-data/cli', { encoding: 'utf8' });
    if (output.includes('@latitude-data/cli')) return true;
  } catch { 
    // do nothing
  }

  vscode.window
    .showErrorMessage('Latitude CLI is not installed.', 'Install Latitude CLI')
    .then(selection => {
      if (!selection) return
      vscode.env.openExternal(vscode.Uri.parse('https://docs.latitude.so/guides/getting-started/installation'))
    });
  
  return false;
}