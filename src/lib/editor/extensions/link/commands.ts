import { Link } from '$lib/editor/extensions/link/link'
import type { EditorState, Transaction } from 'prosemirror-state'

export const removeLinksWithinSelection = (
  state: EditorState,
  dispatch: (tr: Transaction) => void
) => {
  const { $from, $to } = state.selection
  const tr = state.tr

  state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
    if (node.marks.length > 0) {
      node.marks.forEach((mark) => {
        if (mark.type.name === Link.name) {
          tr.removeMark(pos, pos + node.nodeSize, state.schema.marks.link)
        }
      })
    }
  })

  dispatch(tr)
}
