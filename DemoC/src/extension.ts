import * as vscode from 'vscode';
import { getRelativePath } from './main';
const path = require('path');
const sep = path.sep;

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('relative2alias.relative2alias', () => {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor) {
      return;
    }

    const document = activeTextEditor.document;
    const fileName = document.fileName;
    const text = document.getText();
    const relativePaths = getRelativePath(text);

    activeTextEditor.edit(editBuilder => {
      relativePaths.map(({ value, start, end }) => {
        const absolutePath = path.normalize(path.join(path.parse(fileName).dir, value));
        const aliasPath = '@/' + absolutePath.split(`src${sep}`)[1].replace(/\\/g, '/');
        editBuilder.replace(
          new vscode.Range(
            new vscode.Position(start.line, start.column + 1),
            new vscode.Position(end.line, end.column - 1)
          ),
          aliasPath
        );
      });
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
