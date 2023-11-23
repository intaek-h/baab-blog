import { Extension } from '$lib/editor/core/Extension'
import { EditorState, Plugin, PluginKey, TextSelection, type Command } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

const EXTENSION_NAME = 'indicator'

export const INDICATOR_PLUGIN_KEY = new PluginKey(EXTENSION_NAME)

/**
 * 미디어 업로드 시 미디어가 삽입될 자리에 처리중 아이콘을 표시하기 위한 플러그인입니다.
 *
 * 참고한 자료: https://prosemirror.net/examples/upload/
 */
export const indicatorPlugin = () =>
  new Plugin({
    key: INDICATOR_PLUGIN_KEY,
    state: {
      init() {
        return DecorationSet.empty
      },
      apply(tr, set) {
        // Adjust decoration positions to changes made by the transaction
        set = set.map(tr.mapping, tr.doc)

        /**
         * Transaction 의 Meta 데이터에 add 가 있다면 이미지 업로드가 성공한 경우로,
         * remove 가 있다면 실패한 경우로 판단합니다. (startImageUpload 함수의 setMeta 호출 코드 참조)
         */
        // @ts-ignore
        const action = tr.getMeta(this)

        if (action && action.add) {
          // 임시로 들어갈 위젯을 생성합니다.
          const widget = document.createElement('div')

          widget.className = 'h-[300px] w-full animate-pulse bg-[#74cbd51a] rounded-lg'

          // 이미지가 삽입될 자리에 데코레이션이 들어갑니다. 요청이 완료되면 이미지로 대체됩니다.
          const deco = Decoration.widget(action.add.pos, widget, {
            id: action.add.id,
          })

          set = set.add(tr.doc, [deco])
          return set
        }

        if (action && action.remove) {
          set = set.remove(set.find(undefined, undefined, (spec) => spec.id == action.remove.id))
          return set
        }

        return set
      },
    },
    props: {
      decorations(state) {
        return this.getState(state)
      },
    },
  })

/**
 * 찾고 싶은 인디케이터의 아이디 값을 주면 인디케이터의 인덱스를 반환합니다.
 */
export const findIndicator = (state: EditorState, id: Object) => {
  const decos = INDICATOR_PLUGIN_KEY.getState(state)
  const found = decos.find(null, null, (spec: { id: Object }) => spec.id == id)

  return found.length ? found[0].from : null
}

/**
 * 업로드 시작시 커서 위치에 로딩 인디케이터를 표시합니다.
 */
export const displayUploadIndicator =
  (id: Object, coords = null): Command =>
  (state, dispatch, view) => {
    const tr = state.tr

    if (!tr.selection.empty) {
      tr.setSelection(TextSelection.near(state.selection.$to))
    }

    tr.setMeta(INDICATOR_PLUGIN_KEY, {
      add: { id, pos: coords ? view?.posAtCoords(coords)?.pos : tr.selection.from },
    })

    dispatch && dispatch(tr)

    return true
  }

/**
 * 로딩 인디케이터가 표시된 위치에 업로드 실패 문구를 삽입합니다.
 */
export const insertFailureMessage =
  (id: Object): Command =>
  (state, dispatch) => {
    const tr = state.tr

    tr.setMeta(INDICATOR_PLUGIN_KEY, { remove: { id } })

    dispatch && dispatch(tr)

    return true
  }

export const Indicator = Extension.Create({
  name: EXTENSION_NAME,

  addPlugins() {
    return [indicatorPlugin()]
  },

  addCommands() {
    return {
      displayUploadIndicator,
      insertFailureMessage,
    }
  },
})
