/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#F43F73',
          light: '#FFF0F3',
        },
        dark: '#1A1A2E',
        secondary: '#6B7280',
        card: '#F3E8EE',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
        dancing: ['"Dancing Script"', 'cursive'],
      },
      backgroundImage: {
        'pink-gradient': 'linear-gradient(135deg, #F43F73, #FF8FA3)',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(244, 63, 115, 0.08)',
      },
      borderRadius: {
        'xl': '16px',
        'pill': '50px',
      }
    },
  },
  plugins: [],
}
