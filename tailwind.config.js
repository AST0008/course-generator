import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4B0082', // Deep Indigo - Main CTA
        secondary: '#4A90E2', // Electric Blue - Highlights
        accent: '#DCC6E0', // Soft Lavender - Secondary CTA

        background: '#F8F9FA', // Main background
        surface: '#FAFAFF', // Card/Section background
        dark: '#2D2D2D', // Dark elements (headers, footers)

        text: '#1A1A1A', // Main text (high contrast)
        muted: '#5F6C7B', // Secondary text (meta info)

        success: '#00C896', // Success (quiz pass, payments)
        error: '#FF5A5F', // Errors (failed quiz, payment issues)
        warning: '#FFCC00', // Warnings (incomplete modules)
        progress: '#20C997', // Active State (progress bars)

        darkBg: '#1E1E2F', // Background
        cardBg: '#2A2A40', // Card/Surface
        primaryAccent: '#7F5AF0', // Electric Purple (Main Accent)
        accentHover: '#6246EA', // Deep Purple (Hover)
        textLight: '#EAEAEA', // Light Text
        textMuted: '#9CA3AF', // Muted Text
        darkBorder: '#3A3A55', // Border Color
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.08)', // Subtle card shadow
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
});
