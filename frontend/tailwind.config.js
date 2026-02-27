
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
        extend: {
            fontFamily: {
                'sans': ['Inter', 'system-ui', "-apple-system", "Segoe UI", "Roboto", 'sans-serif'],
            },
            colors: {
                app: {
                    bg: "#F9FAFB",
                    surface: "#FFFFFF",
                    subtle: '#F3F4F6',
                    border: "#E5E7EB",
                },
                text: {
                    primary: "#111827",
                    secondary: "#6B7280",
                    muted: "#9CA3AF",
                    inverse: "#FFFFFF",
                },
                primary: {
                    DEFAULT: "#4F46E5",
                    hover: "#4338CA",
                    soft: "#EEF2FF",
                },
                success: "#10B981",
                warning: "#F59E0B",
                danger: "#EF4444",
                info: "#3B82F6",
            },

            borderRadius: {
                lg: '8px',
                xl: "12px",
            },

            boxShadow: {
                card: "0 1px 2px rgba(0, 0, 0, 0.06)",
                cardHover: "0 6px 18px rgba(0, 0, 0, 0.10)",
            },
        
            animation: {
                'border': 'border 4s linear infinite',
            },
            keyframes: {
                'border': {
                    to: { '--border-angle': '360deg' },
                }
            }                      
        },
    }, 
  plugins: [daisyui],
};