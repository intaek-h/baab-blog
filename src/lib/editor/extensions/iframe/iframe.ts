import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

class IframeNodeView {
  iframe: HTMLIFrameElement
  dom: HTMLDivElement

  constructor(
    public node: Node,
    public view: EditorView,
    public getPos: () => number
  ) {
    this.node = node
    this.view = view
    this.getPos = getPos

    this.iframe = document.createElement('iframe')
    this.iframe.src = this.node.attrs.src
    this.iframe.frameBorder = '0'
    this.iframe.allowFullscreen = true
    this.iframe.className = EDITOR_CLASS_NAMES.nodes.iframe
    this.iframe.classList.add('w-full', 'aspect-video', 'shadow-2xl')
    this.iframe.setAttribute('data-youtube-id', this.node.attrs['data-youtube-id'])
    this.iframe.ondrop = (event) => event.preventDefault()

    this.dom = document.createElement('div')
    this.dom.classList.add(EDITOR_CLASS_NAMES.etc.iframeWrapper, 'p-20', 'cursor-pointer')
    this.dom.ondrop = (event) => event.preventDefault()

    this.dom.append(this.iframe)
  }
}

const iframeNodeView = (node: Node, view: EditorView, getPos: () => number) =>
  new IframeNodeView(node, view, getPos)

/**
 * Youtube: 유튜브 임베드 기능, 썸네일(data-youtube-id) 추출 기능.
 */
export const Iframe = Extension.Create({
  name: 'iframe',

  type: 'node',

  defineSpec() {
    return {
      attrs: {
        src: {},
        'data-youtube-id': { default: '' },
        frameborder: { default: 0 },
        allowfullscreen: { default: true },
        class: { default: EDITOR_CLASS_NAMES.nodes.iframe },
      },
      group: 'block',
      marks: '',
      draggable: true,
      toDOM: (node) => [
        'div',
        {
          style: 'display: flex;',
        },
        [
          'iframe',
          {
            src: node.attrs.src,
            frameborder: 0,
            allowfullscreen: true,
            class: node.attrs.class,
            'data-youtube-id': node.attrs['data-youtube-id'],
          },
        ],
      ],
      parseDOM: [
        {
          tag: 'iframe',
          getAttrs(dom) {
            if (!(dom instanceof HTMLElement)) return {}

            const src = dom.getAttribute('src') || ''

            if (!src.startsWith('https://www.youtube.com/embed/')) {
              return {}
            }

            return {
              src: dom.getAttribute('src') || '',
              frameborder: 0,
              allowfullscreen: true,
              'data-youtube-id': dom.getAttribute('data-youtube-id') || '',
            }
          },
        },
      ],
    }
  },

  // @ts-ignore
  addNodeView() {
    return iframeNodeView
  },
})
