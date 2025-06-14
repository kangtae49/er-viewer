import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      sourcemap: false,
      minify: true,
      rollupOptions: {
        external: ['electron']
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {
      sourcemap: false,
      minify: true,
      rollupOptions: {
        external: ['electron']
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@assets': resolve('src/renderer/src/assets'),
        '@preload': resolve('src/preload')
      }
    },
    plugins: [react()]
  }
})
