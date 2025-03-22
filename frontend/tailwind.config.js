/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Japanese-inspired color palette
        'hinomaru-red': '#BC002D', // Japanese flag red
        'hinomaru-bright': '#FF3357', // Brighter version for dark backgrounds
        'sakura': {
          50: '#FFF5F7',
          100: '#FFEAEF',
          200: '#FFCCD6',
          300: '#FFADBD',
          400: '#FF7087',
          500: '#FF3357',
          600: '#E82D4F',
          700: '#C01F3E',
          800: '#981832',
          900: '#7C1329',
        },
        'slate': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        'zen': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // High contrast colors for accessibility
        'high-contrast': {
          light: '#FFFFFF', // White for dark backgrounds
          dark: '#000000',  // Black for light backgrounds
          red: '#FF4D6D',   // Bright red that works on dark backgrounds
          blue: '#4DACFF',  // Bright blue that works on dark backgrounds
          yellow: '#FFDA33', // Bright yellow that works on dark backgrounds
          green: '#4CD97B',  // Bright green that works on dark backgrounds
        },
        // For text on dark backgrounds
        'text-dark': {
          primary: '#FFFFFF',
          secondary: '#E5E7EB',
          muted: '#9CA3AF',
          link: '#FF9FB8',
          'link-hover': '#FFC1D3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        // Add Japanese-inspired fonts
        'noto-sans-jp': ['Noto Sans JP', 'sans-serif'],
        'zen-kaku': ['Zen Kaku Gothic New', 'sans-serif'],
      },
      backgroundImage: {
        'sakura-pattern': "url('/assets/sakura-pattern.png')",
        'zen-wave': "url('/assets/wave-pattern.png')",
      },
      borderRadius: {
        'washi': '0.5rem',
      },
      fontSize: {
        // Slightly larger base sizes for better readability, especially for older users
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
      },
      lineHeight: {
        'relaxed': '1.75',  // More spacing between lines for readability
      },
      boxShadow: {
        'focus': '0 0 0 3px rgba(188, 0, 45, 0.5)',  // Focus state for better accessibility
      },
    },
  },
  plugins: [],
}

