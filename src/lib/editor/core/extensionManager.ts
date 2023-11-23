import type { Schema } from 'prosemirror-model'
import { keymap } from 'prosemirror-keymap'
import { history } from 'prosemirror-history'
import { gapCursor } from 'prosemirror-gapcursor'
import { dropCursor } from 'prosemirror-dropcursor'
import { baseKeymap } from 'prosemirror-commands'
import { InputRule, inputRules as buildInputRules } from 'prosemirror-inputrules'
import type { Extension } from './Extension'
import type { CoreEditor } from './editor'
import { Doc } from '$lib/editor/extensions/doc'
import { Text } from '$lib/editor/extensions/text'
import { Paragraph } from '$lib/editor/extensions/paragraph'
import { HardBreak } from '$lib/editor/extensions/hardBreak'
import { CoreKeyboardShortcuts } from '$lib/editor/extensions/coreKeyboardShortcuts/coreKeyboardShortcuts'
import type { Command } from 'prosemirror-state'
import { createSchemaFromExtensions, mergeKeyboardShortcuts } from '$lib/utils/editor'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'

/**
 * Extension 을 schema, plugin, input rule 등으로 분리합니다.
 */
export class ExtensionManager {
  addedExtensions: Extension[]
  editor: CoreEditor
  schema: Schema<any, any>
  extensions: Extension[]

  constructor(extensions: Extension[], editor: CoreEditor) {
    this.addedExtensions = extensions
    this.extensions = ExtensionManager.Resolve.call(this)
    this.editor = editor
    this.schema = this._createSchema()
  }

  static Resolve(this: ExtensionManager) {
    const coreExtensions = [Doc, Text, Paragraph, HardBreak, CoreKeyboardShortcuts]

    return coreExtensions.concat(this.addedExtensions)
  }

  get plugins() {
    const corePlugins = [
      history(),
      gapCursor(),
      dropCursor({ class: EDITOR_CLASS_NAMES.etc.dropCursor, width: 5, color: '#74cbd5' }),
      keymap(baseKeymap),
    ]
    const inputRules: InputRule[] = []
    const shortKeys: [string, Command][] = []

    const allPlugins = this.extensions.map((extension) => {
      const plugins = []
      const thisValue = {
        editor: this.editor,
        schema: this.schema,
        name: extension.name,
      }

      /**
       * 플러그인을 추가합니다.
       */
      if (extension.addPlugins) {
        plugins.push(...extension.addPlugins.call(thisValue))
      }

      /**
       * 단축키를 추가합니다.
       */
      if (extension.addKeyboardShortcuts) {
        shortKeys.push(...Object.entries(extension.addKeyboardShortcuts.call(thisValue)))
      }

      /**
       * 순회하는 김에 InputRule 을 추가합니다.
       */
      if (extension.addInputRules) {
        inputRules.push(...extension.addInputRules.call(thisValue))
      }

      return plugins
    })

    return [
      keymap(mergeKeyboardShortcuts(shortKeys)),
      ...corePlugins.concat(allPlugins.flat()),
      buildInputRules({ rules: inputRules }),
    ]
  }

  get commands(): Record<string, any> {
    return this.extensions
      .filter((extension) => extension.addCommands)
      .reduce((commands, extension) => {
        const thisValue = {
          editor: this.editor,
          schema: this.schema,
          name: extension.name,
        }

        return { ...commands, ...extension.addCommands!.call(thisValue) }
      }, {})
  }

  get nodeViews() {
    const nodeViewEntries = this.extensions
      .filter((extension) => extension.addNodeView)
      .map((extension) => {
        const thisValue = {
          editor: this.editor,
          schema: this.schema,
          name: extension.name,
        }

        return [extension.name, extension.addNodeView!.call(thisValue)]
      })

    return Object.fromEntries(nodeViewEntries)
  }

  private _createSchema() {
    return createSchemaFromExtensions(this.extensions)
  }
}
