/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        '128': '38rem',
      },
      colors: {
        'neonBlue': '#04D9FF',
        'customBlue': '#20d0f6',
        'webBlue':'#03C8FD',
        'neonYellow':'#F2EA02',
        'neonRed':'#FF3131',
        'neonGreen':'#39FF14',
        'neonPurple':'#B026FF',
         primary: '#171932',
         accent: '#164E35',
      },
      transitionProperty: {
        'underline': 'transform',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

    },
  },
  plugins: [],
};
