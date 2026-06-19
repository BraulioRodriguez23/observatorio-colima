import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Hardcoded production URLs - prevents Vercel env vars from overriding
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://observatorio-d50a062f60ba.herokuapp.com'),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://hqctonqesisnwfbgypti.supabase.co'),
    'import.meta.env.VITE_SUPABASE_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxY3RvbnFlc2lzbndmYmd5cHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjY2NTgsImV4cCI6MjA1ODQwMjY1OH0.OxrbezmmxM8QjhD8N5tLuqigWYtZZupcxqQgl9NOySk'),
  }
})

