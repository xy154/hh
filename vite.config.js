import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base:'/hh/',
  plugins: [vue()],
  build: {
    outDir: 'dist' // 打包输出到dist，固定
  }
})