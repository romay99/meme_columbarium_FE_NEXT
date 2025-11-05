/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        GowunBatang: ['"GowunBatang"', 'sans-serif'],
        GowunBatangBold: ['"GowunBatangBold"', 'sans-serif'], // bold는 폰트-weight로 설정
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
