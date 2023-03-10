import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      svelte({
          onwarn: (warning, handler) => {
            // e.g. don't warn on a11y-autofocus
            if (warning.code === 'a11y-autofocus') return
            if (warning.code === "unused-export-let") return
            if (warning.code === "a11y-click-events-have-key-events") return

            handler(warning)
          }
      })
  ],
  server: {
    watch: {
      usePolling: true
    }
  },
  publicDir: "./global",
  build:   {
    outDir: '/home/ubuntu/Desktop/quasar.name/public/tfw'
  },
  base: ''
})
