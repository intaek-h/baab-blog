import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'

export const Image = Extension.Create({
  name: 'image',

  type: 'node',

  defineSpec() {
    return {
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
        width: { default: null },
        height: { default: 'auto' },
      },
      inline: false,
      group: 'inline',
      draggable: true,
      marks: '',
      toDOM(node) {
        const { src, alt, title, width, height } = node.attrs
        return [
          'img',
          {
            src,
            alt,
            title,
            width,
            height,
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
              title: dom.getAttribute('title'),
              alt: dom.getAttribute('alt'),
              width: dom.getAttribute('width'),
              height: dom.getAttribute('height'),
            }
          },
        },
      ],
    }
  },
})
