import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'main.html'),
        license: resolve(__dirname, 'license.html'),
        background: resolve(__dirname, 'src/background.js'),
        connect: resolve(__dirname, 'src/connect.js'),
        content: resolve(__dirname, 'src/content.js')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})