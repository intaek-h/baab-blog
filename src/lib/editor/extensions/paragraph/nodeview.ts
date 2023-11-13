import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

class ParagraphNodeView {
  dom: HTMLParagraphElement
  contentDOM: HTMLParagraphElement
  constructor(public node: Node, public view: EditorView, public getPos: () => number) {
    this.dom = document.createElement('p')
    this.dom.classList.add(EDITOR_CLASS_NAMES.nodes.paragraph)

    this.contentDOM = this.dom
  }
}

export const paragraphNodeView = (node: Node, view: EditorView, getPos: () => number) =>
  new ParagraphNodeView(node, view, getPos)
