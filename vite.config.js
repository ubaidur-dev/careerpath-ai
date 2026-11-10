import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Poll instead of using inotify so dev never fails with EMFILE when
    // the system's inotify instance limit is exhausted by other apps.
    watch: { usePolling: true, interval: 300 },
  },
})
