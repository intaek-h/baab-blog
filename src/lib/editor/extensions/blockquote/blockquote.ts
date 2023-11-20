import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { wrapIn } from 'prosemirror-commands'
import { wrappingInputRule } from 'prosemirror-inputrules'

export const Blockquote = Extension.Create({
  name: 'blockquote',

  type: 'node',

  defineSpec() {
    return {
      content: '(paragraph|heading|horizontal_rule)+',
      group: 'block',
      defining: true,
      parseDOM: [{ tag: 'blockquote' }],
      toDOM() {
        return ['blockquote', { class: EDITOR_CLASS_NAMES.nodes.blockquote }, 0]
      },
    }
  },

  addCommands() {
    return {
      wrapInBlockquote: wrapIn(this.schema.nodes[this.name]),
    }
  },

  addInputRules() {
    return [wrappingInputRule(/^\s*>\s$/, this.schema.nodes[this.name])]
  },
})
