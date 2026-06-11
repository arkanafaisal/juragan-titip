/** @type {import('tailwindcss').Config} */

const themeTokens = require("./constants/css.js");

const withPixels = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, `${value}px`])
  );
};

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: themeTokens.colors,
      borderRadius: withPixels(themeTokens.radius),
      spacing: withPixels(themeTokens.spacing),
      iconSize: withPixels({ icon: themeTokens.iconSize }),
      fontFamily: {
        'data-lg': ['JetBrains Mono', 'monospace'],
        'data-md': ['JetBrains Mono', 'monospace'],
        'data-sm': ['JetBrains Mono', 'monospace'],
        h1: ['Inter', 'sans-serif'],
        h2: ['Inter', 'sans-serif'],
        h3: ['Inter', 'sans-serif'],
        overline: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'data-lg': ['18px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '600' }],
        'data-md': ['14px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'data-sm': ['12px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '400' }],
        body: ['14px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '400' }],
        h1: ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['20px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        h3: ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '600' }],
        overline: ['11px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '600' }],
        display: ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        caption: ['12px', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '400' }],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}

