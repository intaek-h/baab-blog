import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { liftListItem, splitListItem } from 'prosemirror-schema-list'

export const ListItem = Extension.Create({
  name: 'list_item',

  type: 'node',

  defineSpec() {
    return {
      content: 'paragraph block*',
      defining: true,
      toDOM() {
        return ['li', { class: EDITOR_CLASS_NAMES.nodes.li }, 0]
      },
      parseDOM: [{ tag: 'li' }],
    }
  },

  addCommands() {
    return {
      splitListItem: splitListItem(this.schema.nodes[this.name]),
      liftListItem: liftListItem(this.schema.nodes[this.name]),
      // sinkListItem: sinkListItem(this.schema.nodes[this.name]),
    }
  },

  // TODO: 맨 앞에서 백스페이스 누르며녀 sinkListItem 을 실행하는 커맨드 만들기.
  addKeyboardShortcuts() {
    return {
      Enter: this.editor.commands.splitListItem,
      // Tab: this.editor.commands.sinkListItem,
      'Shift-Tab': this.editor.commands.liftListItem,
      Backspace: (state, dispatch) => {
        console.log('Backspace key pressed')
        if (
          state.selection.empty &&
          state.selection.$anchor.parentOffset === 0 &&
          state.selection.anchor !== 1
        ) {
          const node = state.doc.nodeAt(state.selection.$anchor.pos - 2)

          if (node && node.type.name === this.name) {
            return liftListItem(this.schema.nodes[this.name])(state, dispatch)
          }
        }

        return false
      },
    }
  },
})
