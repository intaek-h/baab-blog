import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { pasteLink } from '$lib/editor/extensions/link/linkPaste'
import { markPasteRule } from '$lib/editor/extensions/link/markPasteRule'
import { createLink, updateLink } from '$lib/utils/editor/link'
import type { ParseRule } from 'prosemirror-model'

export const Link = Extension.Create({
  name: 'link',

  type: 'mark',

  defineSpec() {
    return {
      attrs: {
        href: { default: null },
        download: { default: null },
        target: { default: null },
        style: { default: null }
      },
      inclusive: false,
      toDOM: (node) => [
        'a',
        {
          ...node.attrs,
          class: EDITOR_CLASS_NAMES.marks.link,
          rel: 'noopener noreferrer nofollow'
        },
        0
      ],
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: (dom) => {
            if (typeof dom === 'string') return
            return {
              href: dom.getAttribute('href'),
              download: dom.getAttribute('download')
              // target: dom.getAttribute('target'), // 운영상의 이유로 target 을 제거합니다.
              // style: dom.getAttribute('style'),  // 스타일 통합을 위해 style 을 제거합니다.
            }
          }
        }
      ] as readonly ParseRule[]
    }
  },

  addCommands() {
    return {
      createLink,
      updateLink
    }
  },

  addPlugins() {
    return [
      pasteLink(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
      ),
      markPasteRule(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
        this.schema.marks[this.name],
        (match) => ({ href: match })
      )
    ]
  }
})
