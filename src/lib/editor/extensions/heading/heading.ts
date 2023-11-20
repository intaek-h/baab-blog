import { Extension } from '$lib/editor/core/Extension'
import { EDITOR_CLASS_NAMES } from '$lib/editor/core/classNames'
import { setBlockType } from 'prosemirror-commands'
import { textblockTypeInputRule } from 'prosemirror-inputrules'
import type { NodeType } from 'prosemirror-model'
import type { EditorState } from 'prosemirror-state'

/**
 * Given a node type and a maximum level, creates an input rule that
 * turns up to that number of `#` characters followed by a space at
 * the start of a textblock into a heading whose level corresponds to
 * the number of `#` signs.
 */
const headingRule = (nodeType: NodeType) => {
  return textblockTypeInputRule(/^#\s$/, nodeType)
}

export const Heading = Extension.Create({
  name: 'heading',

  type: 'node',

  defineSpec() {
    return {
      content: 'inline*',
      group: 'block',
      parseDOM: [
        { tag: 'h1' },
        { tag: 'h2' },
        { tag: 'h3' },
        { tag: 'h4' },
        { tag: 'h5' },
        { tag: 'h6' },
      ],
      toDOM: () => ['h2', { class: EDITOR_CLASS_NAMES.nodes.heading }, 0],
    }
  },

  addCommands() {
    return {
      setBlockToHeading: (state: EditorState, dispatch: () => void) =>
        setBlockType(state.schema.nodes[this.name])(state, dispatch),
    }
  },

  addInputRules() {
    return [headingRule(this.schema.nodes[this.name])]
  },
})
