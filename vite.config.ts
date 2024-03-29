import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve  } from 'path'

const pathResolve = (dir:string) => resolve (__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport(),
    Components(),
  ],
  server: {
    open: true,
    port: 4500,
    cors: true,
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': pathResolve('./src'),
      "views": pathResolve('./src/views')
    }
  }
})
