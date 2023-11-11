// @ts-nocheck
// TODO: 내 기억으로는 이 파일들 어느 .ts 라이브러리 코드 긁어와서 .js 로 바꾼건데.. 다시 찾아서 바꿔야함

import { Fragment, Slice } from 'prosemirror-model'

/**
 * 유튜브 링크를 iframe 에 삽입할 수 있는 링크로 변환합니다.
 * 현재 Youtube Shorts 링크를 지원하지 않습니다.
 *
 */
export const generateYoutubeEmbedSrc = (url: string) => {
  const embedUrl = 'https://www.youtube.com/embed/<%= remote_id %>'
  const REGEX =
    /(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)/

  const parseVideoId = ([id, params]: string[]) => {
    if (!params && id) {
      return id
    }

    const paramsMap = {
      start: 'start',
      end: 'end',
      t: 'start',
      time_continue: 'start',
      list: 'list'
    }

    params = params
      .slice(1)
      .split('&')
      .map((param) => {
        const [name, value] = param.split('=')

        if (!id && name === 'v') {
          id = value

          return null
        }

        if (!paramsMap[name]) {
          return null
        }

        if (value === 'LL' || value.startsWith('RDMM') || value.startsWith('FL')) {
          return null
        }

        return `${paramsMap[name]}=${value}`
      })
      .filter((param) => !!param)

    return id + '?' + params.join('&')
  }

  const result = REGEX.exec(url)?.slice(1)
  const videoId = parseVideoId(result)
  const embedSrc = embedUrl.replace(/<%= remote_id %>/g, videoId)

  return { url: embedSrc, videoId }
}

export function mapSlice(slice, callback) {
  const fragment = mapFragment(slice.content, callback)
  return new Slice(fragment, slice.openStart, slice.openEnd)
}

export function mapFragment(content, callback, parent) {
  const children = []
  for (let i = 0, size = content.childCount; i < size; i++) {
    const node = content.child(i)
    const transformed = node.isLeaf
      ? callback(node, parent, i)
      : callback(node.copy(mapFragment(node.content, callback, node)), parent, i)
    if (transformed) {
      if (transformed instanceof Fragment) {
        children.push(...getFragmentBackingArray(transformed))
      } else if (Array.isArray(transformed)) {
        children.push(...transformed)
      } else {
        children.push(transformed)
      }
    }
  }
  return Fragment.fromArray(children)
}

export function getFragmentBackingArray(fragment) {
  return fragment.content
}

/**
 * Runs matchAll and gives range of strings that matched and didnt match
 */
export function matchAllPlus(regexp: RegExp, str: string) {
  const matches = [...str.matchAll(regexp)]
  if (matches.length === 0) {
    return [
      {
        start: 0,
        end: str.length,
        match: false,
        subString: str
      }
    ]
  }

  let result = []
  let prevElementEnd = 0
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i]
    const curStart = cur.index
    // TODO there was an error saying length of undefined in this function
    // I suspect it is coming from line below. But not sure how to reproduce it.
    const curEnd = curStart + cur[0]?.length

    if (prevElementEnd !== curStart) {
      result.push({
        start: prevElementEnd,
        end: curStart,
        match: false
      })
    }
    result.push({
      start: curStart,
      end: curEnd,
      match: true
    })
    prevElementEnd = curEnd
  }

  const lastItemEnd = result[result.length - 1] && result[result.length - 1].end

  if (lastItemEnd && lastItemEnd !== str.length) {
    result.push({
      start: lastItemEnd,
      end: str.length,
      match: false
    })
  }

  result = result.map((r) => ({ ...r, subString: str.slice(r.start, r.end) }))
  return result
}

/**
 * Sets the selection to href
 */
export const createLink = (href: string) => {
  return filter(
    (state) => queryIsLinkAllowedInRange(state.selection.$from.pos, state.selection.$to.pos)(state),
    (state, dispatch) => {
      const [from, to] = [state.selection.$from.pos, state.selection.$to.pos]
      const linkMark = state.schema.marks[Link.name]
      const tr = state.tr.removeMark(from, to, linkMark)

      if (href.trim()) {
        const mark = state.schema.marks[Link.name].create({
          href: href
        })
        tr.addMark(from, to, mark)
      }

      if (dispatch) {
        dispatch(tr)
      }
      return true
    }
  )
}

export const updateLink = (href) => {
  return (state, dispatch) => {
    const imageNode = _findSelectedNodeOfType(state.schema.nodes[Image.name])(state.selection)

    // 이미지를 선택한 상태라면 이미지에 링크를 씌웁니다.
    if (imageNode) {
      const { pos } = imageNode
      const tr = state.tr.removeMark(pos, pos + 1, state.schema.marks[Link.name])
      if (href) {
        tr.addMark(pos, pos + 1, state.schema.marks[Link.name].create({ href }))
      }
      if (dispatch) {
        dispatch(tr)
      }
      return true
    }

    // Selection 이 있다면 Selection 전체에 링크를 씌웁니다.
    if (!state.selection.empty) {
      setLink(state.selection.$from.pos, state.selection.$to.pos, href)(state, dispatch)
      return true
    }

    const hasLink = state.selection.$from
      .marks()
      .some((mark) => mark.type === state.schema.marks[Link.name])

    // 커서 주변에 이미 링크가 씌워져 있다면 링크를 업데이트 합니다.
    if (state.selection.empty && hasLink) {
      const { $from } = state.selection
      const pos = $from.pos - $from.textOffset
      const node = state.doc.nodeAt(pos)
      let to = pos

      if (node) {
        to += node.nodeSize
      }

      setLink(pos, to, href)(state, dispatch)
      return true
    }

    // Selection 과 link Mark 가 모두 없다면 링크가 씌워진 텍스트를 본문에 삽입합니다.
    const text = state.schema.text(href, [state.schema.marks[Link.name].create({ href })])
    const tr = state.tr.replaceSelectionWith(text, false)

    dispatch(tr)
    return true
  }
}
