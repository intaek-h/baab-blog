import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { INDICATOR_PLUGIN_KEY, findIndicator } from '$lib/editor/extensions/indicator/indicator'
import { tailwind } from '$lib/utils/tailwind'
import crelt from 'crelt'
import type { Node } from 'prosemirror-model'
import type { Command } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

type ImageSizeType = 'fit-paragraph' | 'wide-paragraph' | 'fit-window'

/**
 * 참고: https://prosemirror.net/docs/ref/#view.NodeView
 *      https://discuss.prosemirror.net/t/image-resize/1489/6
 *
 */
class ImageNodeView {
  dom: HTMLElement
  showMenu: boolean
  menu: HTMLElement

  constructor(
    public node: Node,
    public view: EditorView,
    public getPos: () => number
  ) {
    this.node = node
    this.view = view
    this.getPos = getPos
    this.showMenu = false

    let imageWidthClassName = ''

    if (node.attrs.type === 'fit-paragraph') {
      imageWidthClassName = 'editor-image-fit-paragraph'
    } else if (node.attrs.type === 'wide-paragraph') {
      imageWidthClassName = 'editor-image-wide-paragraph'
    } else if (node.attrs.type === 'fit-window') {
      imageWidthClassName = 'editor-image-fit-window'
    }

    const outer = crelt('div', {
      class: tailwind`relative my-20 cursor-pointer` + ' ' + imageWidthClassName,
    })

    const image = crelt('img', {
      src: node.attrs.src,
      class: tailwind`w-full`,
      type: node.attrs.type,
    })

    const menu = crelt('div', {
      class: tailwind`invisible absolute -top-20 left-1/2 flex -translate-x-1/2 transform rounded-md bg-gray-100 p-2 shadow-md`,
    })
    menu.onmousedown = (e) => e.preventDefault()

    const fitParagraphIcon = crelt('span', { class: 'material-symbols-outlined' }, 'crop_portrait')
    const wideParagraphIcon = crelt('span', { class: 'material-symbols-outlined' }, 'crop_square')
    const fitWindowIcon = crelt(
      'span',
      { class: 'material-symbols-outlined' },
      'panorama_horizontal'
    )

    const fitParagraph = crelt('button', { class: 'flex' }, fitParagraphIcon)
    fitParagraph.onclick = () => this.resize('fit-paragraph')

    const wideParagraph = crelt('button', { class: 'flex' }, wideParagraphIcon)
    wideParagraph.onclick = () => this.resize('wide-paragraph')

    const fitWindow = crelt('button', { class: 'flex' }, fitWindowIcon)
    fitWindow.onclick = () => this.resize('fit-window')

    crelt(menu, [fitParagraph, wideParagraph, fitWindow])
    crelt(outer, [image, menu])

    this.dom = outer
    this.menu = menu
  }

  selectNode() {
    this.dom.classList.add('outline', 'outline-2')
    this.menu.classList.remove('invisible')
  }

  deselectNode() {
    this.dom.classList.remove('outline', 'outline-2')
    this.menu.classList.add('invisible')
  }

  resize(size: ImageSizeType) {
    const { src, alt } = this.node.attrs
    const { state, dispatch } = this.view
    const { tr } = state
    const pos = this.getPos()

    tr.setNodeMarkup(pos, undefined, {
      src,
      alt,
      type: size,
    })

    dispatch(tr)
  }
}

export const imageNodeView = (node: Node, view: EditorView, getPos: () => number) =>
  new ImageNodeView(node, view, getPos)

/**
 * 로딩 인디케이터가 표시된 위치에 업로드된 이미지를 삽입합니다.
 */
export const insertImage =
  (urls: string[], id: Object): Command =>
  (state, dispatch, view) => {
    if (!view || !dispatch) return false

    const tr = state.tr
    const pos = findIndicator(view.state, id)
    const imageNodes = urls.map((url) =>
      view.state.schema.nodes[Image.name].create({
        src: url,
      })
    )

    tr.insert(pos, imageNodes).setMeta(INDICATOR_PLUGIN_KEY, {
      remove: { id },
    })

    dispatch(tr)

    return true
  }

export const Image = Extension.Create({
  name: 'image',

  type: 'node',

  defineSpec() {
    return {
      attrs: {
        src: {},
        type: { default: 'fit-paragraph' as ImageSizeType },
      },
      group: 'block',
      draggable: true,
      marks: '',
      toDOM(node) {
        const { src, type } = node.attrs
        return [
          'img',
          {
            src,
            type,
            class: EDITOR_CLASS_NAMES.nodes.image,
          },
        ]
      },
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: (dom) => {
            if (typeof dom === 'string') return {}
            return {
              src: dom.getAttribute('src'),
              type: dom.getAttribute('type'),
            }
          },
        },
      ],
    }
  },

  addCommands() {
    return {
      insertImage,
    }
  },

  // @ts-ignore
  addNodeView() {
    return imageNodeView
  },
})
