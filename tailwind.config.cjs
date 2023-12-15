const pixel0To100 = { ...Array.from(Array(101)).map((_, i) => `${i}px`) }

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      spacing: pixel0To100,
      fontSize: pixel0To100,
    },
    fontFamily: {
      sans: ['system-ui', '-apple-system', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      serif: ['Times', 'NanumMyeongjo', 'serif'],
    },
  },
  safelist: [{ pattern: /editor-/ }],
  plugins: [require('daisyui')],
  daisyui: {
    prefix: 'daisy-',
  },
}

module.exports = config
