import { createLink, generateYoutubeEmbedSrc, matchAllPlus } from '$lib/utils/editor/link'
import { Plugin } from 'prosemirror-state'

export const pasteLink = (regexp: RegExp) => {
  return new Plugin({
    props: {
      handlePaste: function handlePastedLink(view, rawEvent) {
        if (!rawEvent.clipboardData) {
          return false
        }

        const text = rawEvent.clipboardData.getData('text/plain')
        const html = rawEvent.clipboardData.getData('text/html')
        const isPlainText = text && !html
        const isYoutubeLink =
          (text.startsWith('https://youtu.be') ||
            text.startsWith('https://www.youtube.com/watch?')) &&
          !text.includes(' ')

        // 유튜브 링크를 붙여넣을 경우 iframe 노드를 생성합니다.
        if (isYoutubeLink) {
          const tr = view.state.tr
          const { from } = view.state.selection
          const { url, videoId } = generateYoutubeEmbedSrc(text)
          const iframeNode = view.state.schema.nodes.iframe.create({
            // TODO: nodes[Iframe.name]
            src: url,
            'data-platform': 'youtube',
            'data-youtube-id': videoId,
          })
          tr.insert(from, iframeNode)
          view.dispatch(tr)
          return false
        }

        if (!isPlainText || view.state.selection.empty) {
          return false
        }

        const { state, dispatch } = view
        const match = matchAllPlus(regexp, text)
        const singleMatch = match.length === 1 && match.every((m) => m.match)

        // Only handle if paste has one URL
        if (!singleMatch) {
          return false
        }

        return createLink(text)(state, dispatch)
      },
    },
  })
}
