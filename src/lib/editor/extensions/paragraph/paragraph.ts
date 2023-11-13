import { setBlockType } from 'prosemirror-commands'

import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import type { EditorState, Transaction } from 'prosemirror-state'
import { paragraphNodeView } from '$lib/editor/extensions/paragraph/nodeview'

/**
 * TODO: 헤딩 바로 밑의 본문은 margin-top 이 얇아야 합니다.
 */

export const Paragraph = Extension.Create({
  name: 'paragraph',

  type: 'node',

  defineSpec() {
    return {
      attrs: {
        focused: { default: null },
      },
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM: (): readonly [string, ...any[]] => {
        return ['p', { class: EDITOR_CLASS_NAMES.nodes.paragraph }, 0]
      },
    }
  },

  addCommands() {
    return {
      setBlockToParagraph: (state: EditorState, dispatch: (tr: Transaction) => void) =>
        setBlockType(state.schema.nodes[this.name])(state, dispatch),
    }
  },

  addKeyboardShortcuts() {
    return {
      'Ctrl-Alt-H': this.editor.commands.setBlockToParagraph,
      'Ctrl-Alt-h': this.editor.commands.setBlockToParagraph,
    }
  },

  // @ts-ignore
  addNodeView() {
    return paragraphNodeView
  },
})
