import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
  workspaceFolder: 'vscode-test/sampleWorkspace',
  files: 'dist-vscode-test/extension.test.js',
});
