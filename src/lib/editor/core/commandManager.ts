import type { CoreEditor } from '$lib/editor/core/editor'
import type { ExtensionManager } from '$lib/editor/core/extensionManager'

export class CommandManager {
  editor: CoreEditor
  unprocessedCommands: ExtensionManager['commands']

  constructor(editor: CoreEditor) {
    this.editor = editor
    this.unprocessedCommands = this.editor.extensionManager.commands
  }

  get commands() {
    return this.unprocessedCommands
  }
}
