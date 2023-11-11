import type { CoreEditor } from '$lib/editor/core/editor'
import type { InputRule } from 'prosemirror-inputrules'
import type { MarkSpec, NodeSpec, Schema } from 'prosemirror-model'
import type { Command, Plugin } from 'prosemirror-state'
import type { NodeView } from 'prosemirror-view'

export interface BaseExtensionConfig {
  name: string
  type?: 'mark' | 'node'
  defineSpec?: (extension: Extension[]) => MarkSpec | NodeSpec
  addPlugins?: (this: ExtensionThis) => Plugin[]
  addKeyboardShortcuts?: (this: ExtensionThis) => Record<string, Command>
  addInputRules?: () => InputRule[]
  addCommands?: () => Record<string, any>
  addNodeView?: () => NodeView
}

export interface MarkExtensionConfig extends BaseExtensionConfig {
  type?: 'mark'
  defineSpec?: (extension: Extension[]) => MarkSpec
}

export interface NodeExtensionConfig extends BaseExtensionConfig {
  type?: 'node'
  defineSpec?: (extension: Extension[]) => NodeSpec
}

export interface ExtensionThis {
  name: string
  editor: CoreEditor
  schema: Schema
}

export type ExtensionConfig = MarkExtensionConfig | NodeExtensionConfig

export class Extension {
  name: ExtensionConfig['name']
  type: ExtensionConfig['type']
  defineSpec: ExtensionConfig['defineSpec']
  addPlugins: ExtensionConfig['addPlugins']
  addKeyboardShortcuts: ExtensionConfig['addKeyboardShortcuts']
  addInputRules: ExtensionConfig['addInputRules']
  addCommands: ExtensionConfig['addCommands']
  addNodeView: ExtensionConfig['addNodeView']

  constructor(config: ExtensionConfig) {
    this.name = config.name
    this.type = config.type
    this.defineSpec = config.defineSpec
    this.addPlugins = config.addPlugins
    this.addKeyboardShortcuts = config.addKeyboardShortcuts
    this.addInputRules = config.addInputRules
    this.addCommands = config.addCommands
    this.addNodeView = config.addNodeView
  }

  /**
   *
   * @param {ExtensionConfig} config
   */
  static Create(config: ExtensionConfig) {
    return new Extension(config)
  }
}
