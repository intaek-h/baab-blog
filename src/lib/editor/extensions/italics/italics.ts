import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { toggleMark } from 'prosemirror-commands'
import type { EditorState } from 'prosemirror-state'

export const Italics = Extension.Create({
  name: 'italics',

  type: 'mark',

  defineSpec() {
    return {
      toDOM() {
        return ['em', { class: EDITOR_CLASS_NAMES.marks.italics }, 0]
      },
      parseDOM: [
        { tag: 'i' },
        { tag: 'em' },
        { style: 'font-style=italic' },
        { style: 'font-style=normal', clearMark: (m) => m.type.name == 'em' }
      ]
    }
  },

  addCommands() {
    return {
      toggleItalics: (state: EditorState, dispatch: () => void) =>
        toggleMark(state.schema.marks[this.name])(state, dispatch)
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-I': this.editor.commands.toggleItalics,
      'Mod-i': this.editor.commands.toggleItalics
    }
  }
})
