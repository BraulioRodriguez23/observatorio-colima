import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Hardcoded production URLs - prevents Vercel env vars from overriding
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://observatorio-d50a062f60ba.herokuapp.com'),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://pdandcmxggfxgblxncsr.supabase.co'),
    'import.meta.env.VITE_SUPABASE_KEY': JSON.stringify('sb_publishable_sk65aZT-7tijg_4RQ13POQ_wkkMu6PZ'),
  }
})

