import { Extension } from '$lib/editor/core/Extension'

export const Text = Extension.Create({
  name: 'text',

  type: 'node',

  defineSpec() {
    return {
      group: 'inline'
    }
  }
})
