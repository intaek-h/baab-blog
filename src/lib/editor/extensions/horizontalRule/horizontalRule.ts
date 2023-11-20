import { EditorState, TextSelection, Transaction } from 'prosemirror-state'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'
import { Extension } from '$lib/editor/core/Extension'
import { Paragraph } from '$lib/editor/extensions/paragraph'
import { Blockquote } from '$lib/editor/extensions/blockquote'
import { InputRule } from 'prosemirror-inputrules'

/**
 * 다음 블록에 Horizontal Rule 노드를 삽입합니다.
 */
export function addHorizontalRuleNextLine(state: EditorState, dispatch: (tr: Transaction) => void) {
  if (!state.selection.empty) return false

  const hrNode = state.schema.nodes[HorizontalRule.name].create()
  const paragraphNode = state.schema.nodes[Paragraph.name].create()
  const selectionHead = state.selection.$head
  const isInsideBlockquote =
    selectionHead.node(selectionHead.depth - 1).type.name === Blockquote.name

  // 인용문 안에 있을 경우 인용문 밖에 가로줄을 삽입하고, 그 밑에 본문 블록을 삽입합니다.
  if (isInsideBlockquote) {
    const insertAt = selectionHead.after(selectionHead.depth - 1)
    const tr = state.tr.insert(insertAt, hrNode).insert(insertAt + 1, paragraphNode)
    const tr2 = tr.setSelection(TextSelection.create(tr.doc, insertAt + 2))

    dispatch(tr2)
    return true
  }

  // 다음 블럭에 가로줄, 그 다음 블럭에 본문 블록을 삽입합니다.
  const endPosOfCurNode = selectionHead.end(selectionHead.depth)
  const tr = state.tr.insert(endPosOfCurNode + 1, hrNode).insert(endPosOfCurNode + 2, paragraphNode)
  const tr2 = tr.setSelection(TextSelection.create(tr.doc, endPosOfCurNode + 3))

  dispatch(tr2)
  return true
}

class HorizontalRuleNodeView {
  dom: HTMLDivElement

  constructor(public node: Node, public view: EditorView, public getPos: () => number) {
    const hr = document.createElement('hr')
    hr.classList.add(EDITOR_CLASS_NAMES.nodes.horizontal_rule)

    this.dom = document.createElement('div')
    this.dom.classList.add(EDITOR_CLASS_NAMES.etc.hrWrapper)
    this.dom.style.width = '100%'
    this.dom.append(hr)
  }
}

export const horizontalRuleNodeView = (node: Node, view: EditorView, getPos: () => number) =>
  new HorizontalRuleNodeView(node, view, getPos)

export const HorizontalRule = Extension.Create({
  name: 'horizontal_rule',

  type: 'node',

  defineSpec() {
    return {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM() {
        return ['hr', { class: EDITOR_CLASS_NAMES.nodes.horizontal_rule }]
      },
    }
  },

  addCommands() {
    return {
      addHorizontalRuleNextLine,
    }
  },

  // @ts-ignore
  addNodeView() {
    return horizontalRuleNodeView
  },

  addInputRules() {
    // --- 입력시 문자를 전부 지우고 p/h 노드를 hr 노드로 교체합니다.
    return [
      new InputRule(/^---$/, (state, _match, start, end) => {
        const $end = state.doc.resolve(end)
        const tr = state.tr

        // 문장에 --- 말고 다른 글자가 있는 경우 HR 을 만들지 않습니다.
        if ($end.after() - end !== 1) return null

        if (!tr.doc.nodeAt($end.after())) {
          const tr2 = tr.replaceRangeWith(start, end, state.schema.nodes[this.name].create())
          const tr3 = tr2.insert(tr2.selection.to, state.schema.nodes[Paragraph.name].create())
          tr3.setSelection(TextSelection.create(tr3.doc, tr3.selection.to + 1))

          return tr3
        }

        return tr.replaceRangeWith(start, end, state.schema.nodes[this.name].create())
      }),
    ]
  },
})
