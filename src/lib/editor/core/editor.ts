import 'prosemirror-view/style/prosemirror.css' // 에디터 여러곳에서 쓰면 계속 가져오나?

import { EditorView, type EditorProps } from 'prosemirror-view'
import { EditorState, Transaction } from 'prosemirror-state'
import type { Extension } from '$lib/editor/core/Extension'
import { DOMSerializer, type Node } from 'prosemirror-model'
import { CommandManager } from '$lib/editor/core/commandManager'
import { EventEmitter, type EditorEvents } from '$lib/editor/core/eventEmitter'
import { ExtensionManager } from '$lib/editor/core/extensionManager'
import { CORE_CLASS_NAME } from '$lib/editor/core/classNames'

type SomeProp = Record<string, any>

export interface CoreEditorConfig {
  extensions: Extension[]
  element: HTMLElement
  editorProps?: EditorProps & SomeProp
  placeholder?: string
}

export class CoreEditor extends EventEmitter<EditorEvents> {
  options: CoreEditorConfig
  view!: EditorView
  extensionManager!: ExtensionManager
  commandManager!: CommandManager

  constructor(options: CoreEditorConfig) {
    super()
    this.options = options
    this._createExtensionManager()
    this._createCommandManager()
    this._createView()
  }

  get state() {
    return this.view.state
  }

  get commands() {
    return this.commandManager.commands
  }

  dispatchTransaction(transaction: Transaction) {
    const state = this.view.state.apply(transaction)

    this.view.updateState(state)

    this.emit('transaction', {
      editor: this,
      transaction,
    })
  }

  getTextContent() {
    return this.state.doc.textBetween(0, this.state.doc.nodeSize - 2, '\n\n')
  }

  createStateFromDoc(doc: Node) {
    return EditorState.create({
      doc: this.extensionManager.schema.nodeFromJSON(doc),
      schema: this.extensionManager.schema,
      plugins: this.extensionManager.plugins,
    })
  }

  destroy() {
    if (this.view) {
      this.view.destroy()
    }

    this.removeAllListeners()
  }

  resetState() {
    this.view.updateState(
      EditorState.create({
        schema: this.extensionManager.schema,
        plugins: this.extensionManager.plugins,
      })
    )
  }

  serialize() {
    return (
      DOMSerializer.fromSchema(this.extensionManager.schema).serializeFragment(
        this.state.doc.content,
        { document },
        document.createElement('div')
      ) as HTMLElement
    ).innerHTML
  }

  private _createExtensionManager() {
    this.extensionManager = new ExtensionManager(this.options.extensions, this)
  }

  private _createCommandManager() {
    this.commandManager = new CommandManager(this)
  }

  private _createView() {
    this.view = new EditorView(this.options.element, {
      ...this.options.editorProps,
      dispatchTransaction: this.dispatchTransaction.bind(this),
      attributes: {
        class: CORE_CLASS_NAME,
        placeholder: this.options.placeholder || '',
      },
      state: EditorState.create({
        schema: this.extensionManager.schema,
        plugins: this.extensionManager.plugins,
      }),
    })

    this._createNodeViews()
  }

  private _createNodeViews() {
    this.view.setProps({
      nodeViews: this.extensionManager.nodeViews,
    })
  }
}
