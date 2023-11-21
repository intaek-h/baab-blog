import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { BulletList } from '$lib/editor/extensions/bulletList'
import { Heading } from '$lib/editor/extensions/heading'
import { OrderedList } from '$lib/editor/extensions/orderedList'
import { Paragraph } from '$lib/editor/extensions/paragraph'
import { chainCommands } from 'prosemirror-commands'
import { GapCursor } from 'prosemirror-gapcursor'
import { Fragment, type NodeRange, type NodeType, type ResolvedPos } from 'prosemirror-model'
import { liftListItem, splitListItem } from 'prosemirror-schema-list'
import type { Command, EditorState, Transaction } from 'prosemirror-state'
import { ReplaceAroundStep } from 'prosemirror-transform'
import { findPositionOfNodeBefore, hasParentNodeOfType } from 'prosemirror-utils'
import type { EditorView } from 'prosemirror-view'

const LIST_ITEM_NODE_NAME = 'list_item'

type PredicateFunction = (state: EditorState, view?: EditorView) => any

export const filter = (
  predicates: PredicateFunction | PredicateFunction[],
  cmd?: Command
): Command => {
  return (state, dispatch, view) => {
    if (cmd == null) {
      return false
    }
    if (!Array.isArray(predicates)) {
      predicates = [predicates]
    }
    if (predicates.some((pred) => !pred(state, view))) {
      return false
    }
    return cmd(state, dispatch, view) || false
  }
}

export function compose(func: Function, ...funcs: Function[]) {
  const allFuncs = [func, ...funcs]
  return function composed(raw: any) {
    return allFuncs.reduceRight((prev, func) => func(prev), raw)
  }
}

export const isEmptySelectionAtStart = (state: EditorState) => {
  const { empty, $from } = state.selection
  return empty && ($from.parentOffset === 0 || state.selection instanceof GapCursor)
}

export const isFirstChildOfParent = (state: EditorState): boolean => {
  const { $from } = state.selection
  return $from.depth > 1
    ? (state.selection instanceof GapCursor && $from.parentOffset === 0) ||
        $from.index($from.depth - 1) === 0
    : true
}

const canOutdent = (type: NodeType) => (state: EditorState) => {
  const { parent } = state.selection.$from
  let listItem = type
  if (!listItem) {
    listItem = state.schema.nodes[LIST_ITEM_NODE_NAME]
  }
  const paragraph = state.schema.nodes[Paragraph.name]

  if (state.selection instanceof GapCursor) {
    return parent.type === listItem
  }

  return parent.type === paragraph && hasParentNodeOfType(listItem)(state.selection)
}

const canToJoinToPreviousListItem = (state: EditorState) => {
  const bulletList = state.schema.nodes[BulletList.name]
  const orderedList = state.schema.nodes[OrderedList.name]
  const { $from } = state.selection
  const $before = state.doc.resolve($from.pos - 1)
  let nodeBefore = $before ? $before.nodeBefore : null
  if (state.selection instanceof GapCursor) {
    nodeBefore = $from.nodeBefore
  }
  return !!nodeBefore && [bulletList, orderedList].indexOf(nodeBefore.type) > -1
}

const mergeLists = (listItem: NodeType, range: NodeRange): ((command: Command) => Command) => {
  return (command) => {
    return (state, dispatch, view) => {
      const newDispatch = (tr: Transaction) => {
        const $start = state.doc.resolve(range.start)
        const $end = state.doc.resolve(range.end)
        const $join = tr.doc.resolve(tr.mapping.map(range.end - 1))
        if ($join.nodeBefore && $join.nodeAfter && $join.nodeBefore.type === $join.nodeAfter.type) {
          if (
            $end.nodeAfter &&
            $end.nodeAfter.type === listItem &&
            $end.parent.type === $start.parent.type
          ) {
            tr.join($join.pos)
          }
        }
        if (dispatch) {
          dispatch(tr.scrollIntoView())
        }
      }
      return command(state, newDispatch, view)
    }
  }
}

export const isInsideListItem = (type: NodeType) => (state: EditorState) => {
  const { $from } = state.selection

  let listItem = type
  if (!listItem) {
    listItem = state.schema.nodes[LIST_ITEM_NODE_NAME]
  }
  const paragraph = state.schema.nodes[Paragraph.name]
  if (state.selection instanceof GapCursor) {
    return $from.parent.type === listItem
  }
  return hasParentNodeOfType(listItem)(state.selection) && $from.parent.type === paragraph
}

export const outdentList = (type: NodeType): Command => {
  return function (state, dispatch, view) {
    let listItem = type
    if (!listItem) {
      listItem = state.schema.nodes[LIST_ITEM_NODE_NAME]
    }
    const { $from, $to } = state.selection
    if (!isInsideListItem(listItem)(state)) {
      return false
    }
    // if we're backspacing at the start of a list item, unindent it
    // take the the range of nodes we might be lifting

    // the predicate is for when you're backspacing a top level list item:
    // we don't want to go up past the doc node, otherwise the range
    // to clear will include everything
    const range = $from.blockRange(
      $to,
      (node) => node.childCount > 0 && node.firstChild!.type === listItem
    )

    if (!range) {
      return false
    }

    const composedCommand = compose(
      mergeLists(listItem, range), // 2. Check if I need to merge nearest list
      liftListItem // 1. First lift list item
    )(listItem)

    return composedCommand(state, dispatch, view)
  }
}

export const findCutBefore = ($pos: ResolvedPos) => {
  // parent is non-isolating, so we can look across this boundary
  if (!$pos.parent.type.spec.isolating) {
    // search up the tree from the pos's *parent*
    for (let i = $pos.depth - 1; i >= 0; i--) {
      // starting from the inner most node's parent, find out
      // if we're not its first child
      if ($pos.index(i) > 0) {
        return $pos.doc.resolve($pos.before(i + 1))
      }
      if ($pos.node(i).type.spec.isolating) {
        break
      }
    }
  }
  return null
}

const joinToPreviousListItem = (type: NodeType): Command => {
  return (state, dispatch) => {
    let listItem = type
    if (!listItem) {
      listItem = state.schema.nodes[LIST_ITEM_NODE_NAME]
    }

    const paragraph = state.schema.nodes[Paragraph.name]
    const heading = state.schema.nodes[Heading.name]
    const bulletList = state.schema.nodes[BulletList.name]
    const orderedList = state.schema.nodes[OrderedList.name]
    const codeBlock = null // TODO: 코드블럭 익스텐션 만들게 되면 추가하기

    const { $from } = state.selection
    const isGapCursorShown = state.selection instanceof GapCursor
    const $cutPos = isGapCursorShown ? state.doc.resolve($from.pos + 1) : $from
    const $cut = findCutBefore($cutPos)
    if (!$cut) {
      return false
    }

    // see if the containing node is a list
    if ($cut.nodeBefore && [bulletList, orderedList].indexOf($cut.nodeBefore.type) > -1) {
      // and the node after this is a paragraph / codeBlock / heading
      if ($cut.nodeAfter && [paragraph, codeBlock, heading].indexOf($cut.nodeAfter.type) > -1) {
        // find the nearest paragraph that precedes this node
        let $lastNode = $cut.doc.resolve($cut.pos - 1)

        while ($lastNode.parent.type !== paragraph) {
          $lastNode = state.doc.resolve($lastNode.pos - 1)
        }

        let { tr } = state
        if (isGapCursorShown) {
          const nodeBeforePos = findPositionOfNodeBefore(tr.selection)
          if (typeof nodeBeforePos !== 'number') {
            return false
          }
          // append the paragraph / codeblock / heading to the list node
          const list = $cut.nodeBefore.copy(
            $cut.nodeBefore.content.append(
              Fragment.from(listItem.createChecked({}, $cut.nodeAfter))
            )
          )
          tr.replaceWith(nodeBeforePos, $from.pos + $cut.nodeAfter.nodeSize, list)
        } else {
          // take the text content of the paragraph and insert after the paragraph up until before the the cut
          tr = tr.step(
            new ReplaceAroundStep(
              $lastNode.pos,
              $cut.pos + $cut.nodeAfter.nodeSize,
              $cut.pos + 1,
              $cut.pos + $cut.nodeAfter.nodeSize - 1,
              state.tr.doc.slice($lastNode.pos, $cut.pos),
              0,
              true
            )
          )
        }

        // find out if there's now another list following and join them
        // as in, [list, p, list] => [list with p, list], and we want [joined list]
        const $postCut = tr.doc.resolve(tr.mapping.map($cut.pos + $cut.nodeAfter.nodeSize))
        if (
          $postCut.nodeBefore &&
          $postCut.nodeAfter &&
          $postCut.nodeBefore.type === $postCut.nodeAfter.type &&
          [bulletList, orderedList].indexOf($postCut.nodeBefore.type) > -1
        ) {
          tr = tr.join($postCut.pos)
        }

        if (dispatch) {
          dispatch(tr.scrollIntoView())
        }
        return true
      }
    }

    return false
  }
}

const deletePreviousEmptyListItem = (type: NodeType): Command => {
  return (state, dispatch) => {
    const { $from } = state.selection
    let listItem = type
    if (!listItem) {
      listItem = state.schema.nodes[LIST_ITEM_NODE_NAME]
    }
    const $cut = findCutBefore($from)
    if (!$cut || !$cut.nodeBefore || !($cut.nodeBefore.type === listItem)) {
      return false
    }

    const previousListItemEmpty =
      $cut.nodeBefore.childCount === 1 && $cut.nodeBefore.firstChild!.nodeSize <= 2
    if (previousListItemEmpty) {
      const { tr } = state
      if (dispatch) {
        dispatch(tr.delete($cut.pos - $cut.nodeBefore.nodeSize, $from.pos).scrollIntoView())
      }
      return true
    }
    return false
  }
}

export const ListItem = Extension.Create({
  name: LIST_ITEM_NODE_NAME,

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
    }
  },

  addKeyboardShortcuts() {
    return {
      Enter: this.editor.commands.splitListItem,
      'Shift-Tab': this.editor.commands.liftListItem,
      // 백스페이스 커맨드 참고 자료: https://github.com/bangle-io/bangle-editor/blob/900b1513222326214de09035387f43e0b0f92d50/core/components/list-item/commands.js#L601
      Backspace: chainCommands(
        filter(
          [
            isInsideListItem(this.schema.nodes[this.name]),
            isEmptySelectionAtStart,
            // list items might have multiple paragraphs; only do this at the first one
            isFirstChildOfParent,
            canOutdent(this.schema.nodes[this.name]),
          ],
          chainCommands(
            deletePreviousEmptyListItem(this.schema.nodes[this.name]),
            outdentList(this.schema.nodes[this.name])
          )
        ),
        // if we're just inside a paragraph node (or gapcursor is shown) and backspace, then try to join
        // the text to the previous list item, if one exists
        filter(
          [isEmptySelectionAtStart, canToJoinToPreviousListItem],
          joinToPreviousListItem(this.schema.nodes[this.name])
        )
      ),
    }
  },
})
