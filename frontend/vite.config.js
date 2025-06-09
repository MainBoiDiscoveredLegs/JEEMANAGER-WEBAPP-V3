import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/JEEMANAGER-WEBAPP-V3/',
  plugins: [react()],
}));
