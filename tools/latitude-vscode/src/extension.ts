import * as vscode from 'vscode';
import { activate as activateCustomLanguages } from './syntaxes';
import { activate as activateCommands } from './commands';

export function activate(context: vscode.ExtensionContext) {
  activateCustomLanguages(context);
  activateCommands(context);
}

export function deactivate() {
}