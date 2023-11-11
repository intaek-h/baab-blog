import { mapSlice, matchAllPlus } from '$lib/utils/editor/link'
import type { MarkType, Node } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

export const markPasteRule = (
  regexp: RegExp,
  type: MarkType,
  getAttrs: (match: string) => { href: string }
) => {
  return new Plugin({
    props: {
      transformPasted: function (slice) {
        return mapSlice(slice, (node: Node) => {
          if (!node.isText) {
            return node
          }
          const text = node.text || ''
          const matches = matchAllPlus(regexp, text)
          return matches.map(({ start, end, match, subString }) => {
            let newNode = node.cut(start!, end)
            if (match) {
              const attrs = getAttrs instanceof Function ? getAttrs(subString) : getAttrs
              newNode = newNode.mark(type.create(attrs).addToSet(node.marks))
            }
            return newNode
          })
        })
      }
    }
  })
}
