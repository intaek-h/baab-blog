import { Extension } from '$lib/editor/core/Extension'
import { floatingMenuPlugin } from '$lib/editor/extensions/floatingMenu/floatingMenuPlugin'

export const FloatingMenu = Extension.Create({
  name: 'floating_menu',

  addPlugins() {
    return [floatingMenuPlugin(this.editor)]
  }
})
