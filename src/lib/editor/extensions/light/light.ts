import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { toggleMark } from 'prosemirror-commands'
import type { EditorState } from 'prosemirror-state'

export const Light = Extension.Create({
  name: 'light',

  type: 'mark',

  defineSpec() {
    return {
      toDOM() {
        return ['span', { class: EDITOR_CLASS_NAMES.marks.light }, 0]
      },
      parseDOM: [
        {
          tag: 'span',
          getAttrs: (node) => {
            if (typeof node === 'string') return false
            if (node.classList.contains(EDITOR_CLASS_NAMES.marks.light)) return null
            return false
          },
        },
      ],
    }
  },

  addCommands() {
    return {
      toggleLight: (state: EditorState, dispatch: () => void) =>
        toggleMark(state.schema.marks[this.name])(state, dispatch),
    }
  },
})
