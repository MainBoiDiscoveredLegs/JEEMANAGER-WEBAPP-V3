import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/JEEMANAGER-WEBAPP-V3/',
  plugins: [react()],
});
