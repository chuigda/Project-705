import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
   plugins: [vue()],
   resolve: {
      alias: {
         '@app': resolve(__dirname, 'src'),
         '@rulesets': resolve(__dirname, 'rulesets')
      }
   },
   server: {
      port: 8000,
      proxy: {
         '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true
         }
      }
   },
   assetsInclude: [
      '**/*.png'
   ]
})
