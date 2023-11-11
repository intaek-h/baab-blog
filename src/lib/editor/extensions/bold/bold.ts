import { Extension } from '$lib/editor/core/Extension'

export const Strong = Extension.Create({
  name: 'strong',

  type: 'mark',

  defineSpec() {
    return {
      toDOM() {
        return ['strong', { class: MEDISTREAM_SCHEMA_STYLE.marks.strong }, 0]
      },
      parseDOM: [
        { tag: 'strong' },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        { tag: 'b', getAttrs: (node) => node.style.fontWeight != 'normal' && null },
        { style: 'font-weight=400', clearMark: (m) => m.type.name == 'strong' },
        {
          style: 'font-weight',
          getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
        }
      ]
    }
  },

  addCommands() {
    return {
      toggleStrong: (state, dispatch) => toggleMark(state.schema.marks[this.name])(state, dispatch)
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-B': this.editor.commands.toggleStrong,
      'Mod-b': this.editor.commands.toggleStrong
    }
  }
})
