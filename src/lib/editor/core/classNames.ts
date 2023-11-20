export const CORE_CLASS_NAME = 'ith'

export const EDITOR_CLASS_NAMES = {
  nodes: {
    paragraph: CORE_CLASS_NAME + '__paragraph',
    heading: CORE_CLASS_NAME + '__heading',
    blockquote: CORE_CLASS_NAME + '__blockquote',
    horizontal_rule: CORE_CLASS_NAME + '__horizontal-rule',
    br: CORE_CLASS_NAME + '__br',
    li: CORE_CLASS_NAME + '__li',
    ul: CORE_CLASS_NAME + '__ul',
    ol: CORE_CLASS_NAME + '__ol',
  },
  marks: {
    bold: CORE_CLASS_NAME + '__bold',
    link: CORE_CLASS_NAME + '__link',
    italics: CORE_CLASS_NAME + '__italics',
  },
  etc: {
    floatingMenu: CORE_CLASS_NAME + '__floating-menu',
    dropCursor: CORE_CLASS_NAME + '__drop-cursor',
    hrWrapper: CORE_CLASS_NAME + '__hr-wrapper',
  },
}
