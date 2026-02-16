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
          50: '#e3f2fd',
          100: '#bbdefb',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
        },
        success: '#52c41a',
        warning: '#faad14',
        error: '#f5222d',
        info: '#1890ff',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}