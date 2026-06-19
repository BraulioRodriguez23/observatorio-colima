import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Hardcoded production URLs - prevents Vercel env vars from overriding
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://observatorio-d50a062f60ba.herokuapp.com'),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://pdandcmxggfxgblxncsr.supabase.co'),
    'import.meta.env.VITE_SUPABASE_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkYW5kY214Z2dmeGdibHhuY3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDA1MjcsImV4cCI6MjA5NjAxNjUyN30.wMjJzPuRhoiPsMcT2EgYgr_dVsi-embNfOIR8p4w9Io'),
  }
})

