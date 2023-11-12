import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { toggleMark } from 'prosemirror-commands'
import type { ParseRule } from 'prosemirror-model'
import type { EditorState } from 'prosemirror-state'

export const Bold = Extension.Create({
  name: 'bold',

  type: 'mark',

  defineSpec() {
    return {
      toDOM() {
        return ['strong', { class: EDITOR_CLASS_NAMES.marks.bold }, 0]
      },
      parseDOM: [
        { tag: 'strong' },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        {
          tag: 'b',
          getAttrs: (node) => {
            if (typeof node === 'string') return
            node.style.fontWeight != 'normal' && null
          }
        },
        { style: 'font-weight=400', clearMark: (m) => m.type.name == 'bold' },
        {
          style: 'font-weight',
          getAttrs: (value) => {
            if (typeof value === 'object') return
            ;/^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
          }
        }
      ] as readonly ParseRule[]
    }
  },

  addCommands() {
    return {
      toggleBold: (state: EditorState, dispatch: () => void) =>
        toggleMark(state.schema.marks[this.name])(state, dispatch)
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-B': this.editor.commands.toggleBold,
      'Mod-b': this.editor.commands.toggleBold
    }
  }
})
