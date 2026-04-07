export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#6366F1', dark: '#4F46E5', light: '#EEF2FF' },
        secondary: { DEFAULT: '#0EA5E9', light: '#E0F2FE' },
        success:   { DEFAULT: '#10B981', light: '#D1FAE5' },
        warning:   { DEFAULT: '#F59E0B', light: '#FEF3C7' },
        danger:    { DEFAULT: '#EF4444', light: '#FEE2E2' },
      }
    }
  },
  plugins: [],
}
