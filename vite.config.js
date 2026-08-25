import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The published site lives at https://dynagi.github.io/Tarun-Birthday/, so the
// production build needs that sub-path baked into every asset URL. Dev keeps
// `/` so `npm run dev` still serves from the root of localhost.
// `isPreview` is included so `npm run preview` mirrors the deployed sub-path;
// without it preview serves at `/` and every asset 404s.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/Tarun-Birthday/' : '/',
  plugins: [react(), tailwindcss()],
}))
