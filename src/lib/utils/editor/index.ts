import type { Extension } from '$lib/editor/core/Extension'
import { chainCommands } from 'prosemirror-commands'
import { Schema, type MarkSpec, type NodeSpec } from 'prosemirror-model'
import type { Command } from 'prosemirror-state'

/**
 * 동일한 키보드 단축키를 가진 커맨드들을 하나의 커맨드로 합쳐줍니다.
 */
export const mergeKeyboardShortcuts = (shortcuts: [string, Command][]) => {
  /**
   * {
   *  'Mod-b': [command1, command2],
   * }
   */
  const shortcutArrays = shortcuts.reduce((acc, [key, command]) => {
    if (acc[key]) {
      acc[key].push(command)
      return acc
    }

    acc[key] = [command]
    return acc
  }, {} as Record<string, Command[]>)

  /**
   * {
   *  'Mod-b': chainCommands(command1, command2),
   * }
   */
  const chainedShortcuts = Object.keys(shortcutArrays).reduce((acc, key) => {
    if (!Array.isArray(shortcutArrays[key])) return acc
    acc[key] = chainCommands(...shortcutArrays[key])
    return acc
  }, {} as Record<string, Command>)

  return chainedShortcuts
}

export const createSchemaFromExtensions = (extensions: Extension[]) => {
  const marks = extensions
    .filter((extension) => extension.type === 'mark')
    .reduce((acc, extension) => {
      // @ts-ignore
      acc[extension.name] = extension.defineSpec!(extensions)
      return acc
    }, {} as Record<string, MarkSpec>)

  const nodes = extensions
    .filter((extension) => extension.type === 'node')
    .reduce((acc, extension) => {
      // @ts-ignore
      acc[extension.name] = extension.defineSpec!(extensions)
      return acc
    }, {} as Record<string, NodeSpec>)

  return new Schema({ marks, nodes })
}
