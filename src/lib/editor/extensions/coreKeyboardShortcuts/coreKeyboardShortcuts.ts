import { Extension } from '$lib/editor/core/Extension'
import { joinDown, joinUp, lift, splitBlock } from 'prosemirror-commands'
import { redo, undo } from 'prosemirror-history'
import { undoInputRule } from 'prosemirror-inputrules'

export const CoreKeyboardShortcuts = Extension.Create({
  name: 'core_keyboard_shortcuts',

  addCommands() {
    return {
      undo,
      redo,
      splitBlock,
      undoInputRule,
      joinUp,
      joinDown,
      lift,
    }
  },

  addKeyboardShortcuts() {
    const mac =
      typeof navigator != 'undefined' ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : false

    return {
      'Mod-Z': this.editor.commands.undo,
      'Mod-z': this.editor.commands.undo,
      [mac ? 'Shift-Mod-Z' : 'Mod-Y']: this.editor.commands.redo,
      [mac ? 'Shift-Mod-z' : 'Mod-y']: this.editor.commands.redo,
      'Alt-ArrowUp': this.editor.commands.joinUp,
      'Alt-ArrowDown': this.editor.commands.joinDown,
      'Mod-BracketLeft': this.editor.commands.lift,
      // Backspace: this.editor.commands.undoInputRule, // 사용성이 좋지 않은 관계로 주석 처리합니다. 추후 판단해서 삭제할 수 있습니다.
    }
  },
})
