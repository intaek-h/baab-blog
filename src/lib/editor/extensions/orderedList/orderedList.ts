import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { wrappingInputRule } from 'prosemirror-inputrules'
import type { NodeType } from 'prosemirror-model'
import { wrapInList } from 'prosemirror-schema-list'

/**
 * Given a list node type, returns an input rule that turns a number
 * followed by a dot at the start of a textblock into an ordered list.
 *
 */
const orderedListRule = (nodeType: NodeType) => {
  return wrappingInputRule(
    /^(1)\.\s$/,
    nodeType,
    (match) => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order == +match[1]
  )
}

export const OrderedList = Extension.Create({
  name: 'ordered_list',

  type: 'node',

  defineSpec() {
    return {
      group: 'block',
      content: 'list_item+',
      attrs: { order: { default: 1 } },
      toDOM: () => ['ol', { class: EDITOR_CLASS_NAMES.nodes.ol }, 0],
      parseDOM: [
        {
          tag: 'ol',
          getAttrs: (dom) => {
            if (!(dom instanceof HTMLElement)) return false
            return {
              order: dom.hasAttribute('start') ? +dom.getAttribute('start')! : 1,
            }
          },
        },
      ],
    }
  },

  addCommands() {
    return {
      wrapInOrderedList: wrapInList(this.schema.nodes[this.name]),
    }
  },

  addInputRules() {
    return [orderedListRule(this.schema.nodes[this.name])]
  },
})
