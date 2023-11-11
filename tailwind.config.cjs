/** @type {import('tailwindcss').Config}*/
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {},
    fontFamily: {
      // serif: ['Times', 'BareunBatang', 'serif']
      serif: ['Times', 'NanumMyeongjo', 'serif']
      // serif: ['Times', 'serif']
    }
  },

  plugins: []
}

module.exports = config
