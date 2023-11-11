import { Extension } from '$lib/editor/core/Extension'

export const Doc = Extension.Create({
  name: 'doc',

  type: 'node',

  defineSpec() {
    return {
      content: 'block+'
    }
  }
})
