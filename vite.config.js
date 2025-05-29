import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  darkMode: 'class',  // ✅ MUST BE 'class'
  plugins: [react(),tailwindcss()],
})
