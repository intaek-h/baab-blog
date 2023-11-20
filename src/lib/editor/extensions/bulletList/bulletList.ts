import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { wrappingInputRule } from 'prosemirror-inputrules'
import type { NodeType } from 'prosemirror-model'
import { wrapInList } from 'prosemirror-schema-list'

/**
 * Given a list node type, returns an input rule that turns a bullet
 * (dash, plush, or asterisk) at the start of a textblock into a
 * bullet list.
 *
 */
const bulletListRule = (nodeType: NodeType) => {
  return wrappingInputRule(/^-\s$/, nodeType)
}

export const BulletList = Extension.Create({
  name: 'bullet_list',

  type: 'node',

  defineSpec() {
    return {
      group: 'block',
      content: 'list_item+',
      toDOM() {
        return ['ul', { class: EDITOR_CLASS_NAMES.nodes.ul }, 0]
      },
      parseDOM: [{ tag: 'ul' }],
    }
  },

  addCommands() {
    return {
      wrapInBulletList: wrapInList(this.schema.nodes[this.name]),
    }
  },

  addInputRules() {
    return [bulletListRule(this.schema.nodes[this.name])]
  },
})
