export const CORE_CLASS_NAME = 'editor'

export const EDITOR_CLASS_NAMES = {
  nodes: {
    paragraph: CORE_CLASS_NAME + '-paragraph',
    heading: CORE_CLASS_NAME + '-heading',
    blockquote: CORE_CLASS_NAME + '-blockquote',
    horizontal_rule: CORE_CLASS_NAME + '-horizontal-rule',
    image: CORE_CLASS_NAME + '-image',
    br: CORE_CLASS_NAME + '-br',
    li: CORE_CLASS_NAME + '-li',
    ul: CORE_CLASS_NAME + '-ul',
    ol: CORE_CLASS_NAME + '-ol',
    iframe: CORE_CLASS_NAME + '-iframe',
  },
  marks: {
    light: CORE_CLASS_NAME + '-light',
    bold: CORE_CLASS_NAME + '-bold',
    link: CORE_CLASS_NAME + '-link',
    italics: CORE_CLASS_NAME + '-italics',
  },
  etc: {
    floatingMenu: CORE_CLASS_NAME + '-floating-menu',
    dropCursor: CORE_CLASS_NAME + '-drop-cursor',
    hrWrapper: CORE_CLASS_NAME + '-hr-wrapper',
    iframeWrapper: CORE_CLASS_NAME + '-iframe-wrapper',
  },
}
