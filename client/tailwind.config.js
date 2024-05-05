// Importing TailwindCSS configuration types and necessary utilities
const { Config } = require('tailwindcss');
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

// Function to add CSS variables for colors based on the theme
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}

// Consolidated TailwindCSS configuration
const config = {
  darkMode: 'class', // Enable dark mode using the class strategy
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './mdx-components.tsx',
    'content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        bgcolor: {
          DEFAULT: '#080808',
          primary: '#1d1d1d',
        },
        accent: {
          DEFAULT: '#268de0',
          light: '#5daef0',
        },
        shadowcolor: {
          DEFAULT: "#EDEDED",
          light: "#F5F5F5",
        },
      },
      dropShadow: {
        glow: ['0 0px 20px rgba(255 ,255, 255, 1)', '0 0px 65px rgba(255, 255, 255, 0.7)'],
        glowAccent: ['0 0px 20px rgba(34, 100, 186, 0.7)', '0 0px 65px rgba(34, 100, 186, 0.7)'],
        glowSmall: ['0 0px 10px rgba(34, 100, 186, 0.7)', '0 0px 20px rgba(34, 100, 186, 0.7)'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 20px 25px -10px rgb(34, 100, 186, 0.7)',
        input: '0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)',
      },
      fontFamily: {
        primary: 'Poppins',
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-calsans)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'microphone': 'url("./mic-background.jpeg")',
      },
      animation: {
        'fade-in': 'fade-in 3s ease-in-out forwards',
        title: 'title 3s ease-out forwards',
        'fade-left': 'fade-left 3s ease-in-out forwards',
        'fade-right': 'fade-right 3s ease-in-out forwards',
        aurora: 'aurora 60s linear infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0%',
          },
          '75%': {
            opacity: '0%',
          },
          '100%': {
            opacity: '100%',
          },
        },
        'fade-left': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0%',
          },
          '30%': {
            transform: 'translateX(0%)',
            opacity: '100%',
          },
          '100%': {
            opacity: '0%',
          },
        },
        'fade-right': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0%',
          },
          '30%': {
            transform: 'translateX(0%)',
            opacity: '100%',
          },
          '100%': {
            opacity: '0%',
          },
        },
        title: {
          '0%': {
            'line-height': '0%',
            'letter-spacing': '0.25em',
            opacity: '0',
          },
          '25%': {
            'line-height': '0%',
            opacity: '0%',
          },
          '80%': {
            opacity: '100%',
          },
          '100%': {
            'line-height': '100%',
            opacity: '100%',
          },
        },
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-debug-screens'),
    require('tailwindcss-animate'),
    addVariablesForColors, // Adding color variables plugin
  ],
};

// Exporting the consolidated configuration
module.exports = config;