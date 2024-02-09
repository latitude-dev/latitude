import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      letterSpacing: {
        wide: '1px',
      },
      fontSize: {
        h2: '26px',
      },
      lineHeight: {
        h1: '48px',
      },
      boxShadow: {
        '1p': '0px 0px 4px rgba(28, 36, 43, 0.08), 0px 4px 8px rgba(28, 36, 43, 0.08), 0px 8px 32px rgba(28, 36, 43, 0.08)',
        '2p': '0px 0px 4px rgba(7, 19, 36, 0.08), 0px 8px 24px rgba(7, 19, 36, 0.12), 0px 16px 80px rgba(7, 19, 36, 0.08)',
        '1pInset': 'inset 0px 0px 0px 1px var(--tw-shadow)',
        'solid-2': '0 0 0 2px var(--tw-shadow)',
      },
      colors: {
        primary: {
          100: '#E5F2FF',
          200: '#CCE1FF',
          400: '#B3D8FF',
          500: '#80BFFF',
          1000: '#0080FF',
          1200: '#0058B0',
        },
        gray: {
          100: '#F7F7F8',
          200: '#EFF0F1',
          300: '#A2A9AC',
          400: '#D3D6DA',
          600: '#A2A6AC',
          800: '#63676D',
          850: '#2A3037',
          900: '#071324',
        },
        yellow: {
          200: '#FFF4D1',
          500: '#FFE28D',
          1000: '#FEC61A',
          1200: '#926E01',
        },
        red: {
          100: '#FCEBED',
          200: '#FAD7DA',
          500: '#F29CA3',
          1000: '#E53948',
          1200: '#B11320',
        },
        green: {
          100: '#E8F8EB',
          200: '#D0F1D8',
          500: '#8FDBA2',
          1000: '#5CCC78',
          1200: '#127D2D',
        },
      },
    },
  },
}
