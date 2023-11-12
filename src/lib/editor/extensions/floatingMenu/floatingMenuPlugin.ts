import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import type { CoreEditor } from '$lib/editor/core/editor'
import { Link } from '$lib/editor/extensions/link/link'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

export const FLOATING_MENU_PLUGIN_KEY = new PluginKey('floating_menu')

class floatingMenuPluginView {
  view: EditorView
  container: HTMLDivElement
  titleBtn: HTMLButtonElement
  paragraphBtn: HTMLButtonElement
  boldBtn: HTMLButtonElement
  italicsBtn: HTMLButtonElement
  linkBtn: HTMLButtonElement
  CLASSNAME: string
  private __hideMenuOnMouseDown: (event: MouseEvent) => void
  arrow: HTMLDivElement

  constructor(view: EditorView, editor: CoreEditor) {
    this.view = view
    this.CLASSNAME = EDITOR_CLASS_NAMES.etc.floatingMenu

    this.container = document.createElement('div')
    this.container.style.display = 'none'
    this.container.classList.add(this.CLASSNAME, 'shadow-xs')
    this.container.onmousedown = (event) => event.preventDefault()

    this.arrow = document.createElement('div')
    this.arrow.classList.add(`${this.CLASSNAME}__arrow`)

    this.titleBtn = document.createElement('button')
    this.titleBtn.textContent = '머릿말'
    this.titleBtn.classList.add(`${this.CLASSNAME}__title`)
    this.titleBtn.onclick = () => editor.commands.setBlockToHeading(editor.state, view.dispatch)

    this.paragraphBtn = document.createElement('button')
    this.paragraphBtn.textContent = '본문'
    this.paragraphBtn.classList.add(`${this.CLASSNAME}__paragraph`)
    this.paragraphBtn.onclick = () =>
      editor.commands.setBlockToParagraph(editor.state, view.dispatch)

    this.boldBtn = document.createElement('button')
    this.boldBtn.textContent = '굵게'
    this.boldBtn.classList.add(`${this.CLASSNAME}__bold`)
    this.boldBtn.onclick = () => editor.commands.toggleBold(editor.state, view.dispatch)

    this.italicsBtn = document.createElement('button')
    this.italicsBtn.textContent = '기울게'
    this.italicsBtn.classList.add(`${this.CLASSNAME}__italics`)
    this.italicsBtn.onclick = () => editor.commands.toggleItalics(editor.state, view.dispatch)

    this.linkBtn = document.createElement('button')
    this.linkBtn.style.display = 'none'
    this.linkBtn.textContent = '링크제거'
    this.linkBtn.classList.add(`${this.CLASSNAME}__link`)
    this.linkBtn.onclick = () =>
      editor.commands.removeLinksWithinSelection(editor.state, view.dispatch)

    this.container.appendChild(this.arrow)
    this.container.appendChild(this.titleBtn)
    this.container.appendChild(this.paragraphBtn)
    this.container.appendChild(this.boldBtn)
    this.container.appendChild(this.italicsBtn)
    this.container.appendChild(this.linkBtn)
    view.dom.parentNode?.appendChild(this.container)

    this.__hideMenuOnMouseDown = this.hideMenuOnMouseDown.bind(this)
    window.addEventListener('mousedown', this.__hideMenuOnMouseDown)
  }

  update(view: EditorView) {
    if (!view.state.selection.empty) {
      // 셀렉션에 링크가 있는 경우 링크 제거 버튼을 보여줍니다.
      if (
        view.state.doc.rangeHasMark(
          view.state.selection.from,
          view.state.selection.to,
          view.state.schema.marks[Link.name]
        )
      ) {
        this.showLinkRemoveButton()
      } else {
        this.hideLinkRemoveButton()
      }
      this.showMenu()
      return
    }

    this.container.style.display = 'none'
  }

  destroy() {
    window.removeEventListener('mousedown', this.__hideMenuOnMouseDown)
  }

  private showMenu() {
    this.container.style.display = 'flex'

    if (!this.container.offsetParent) return

    const box = this.container.offsetParent.getBoundingClientRect()
    const { left, top } = this.view.coordsAtPos(this.view.state.selection.head)

    this.container.style.bottom = `${box.bottom - top + 6}px`
    this.container.style.left = `${left - box.left}px`
    this.container.style.transform = 'translateX(-50%)'
  }

  private hideMenuOnMouseDown(event: MouseEvent) {
    event.stopPropagation()
    if ((event.target as HTMLElement)?.closest(`.${this.CLASSNAME}`)) return
    this.hideMenu()
  }

  private hideMenu() {
    this.hideLinkRemoveButton()
    this.container.style.display = 'none'
  }

  private showLinkRemoveButton() {
    this.linkBtn.style.display = 'block'
  }

  private hideLinkRemoveButton() {
    this.linkBtn.style.display = 'none'
  }
}

export const floatingMenuPlugin = (editor: CoreEditor) =>
  new Plugin({
    key: FLOATING_MENU_PLUGIN_KEY,
    state: {
      init() {
        return undefined // or 'open'
      },
      apply(_, state) {
        if (state) {
          return state
        }
      },
    },
    view: (view) => new floatingMenuPluginView(view, editor),
  })
