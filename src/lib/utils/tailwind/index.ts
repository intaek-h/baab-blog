/**
 * Tailwind 클래스명 순서 정렬
 * https://github.com/tailwindlabs/prettier-plugin-tailwindcss#sorting-classes-in-template-literals
 */
export const tailwind = (strings: TemplateStringsArray, ...values: any[]) =>
  String.raw({ raw: strings }, ...values)
