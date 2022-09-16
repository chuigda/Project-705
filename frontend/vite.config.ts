import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { resolve } from 'path'

export default defineConfig({
   plugins: [
      vue(),
      // @ts-ignore
      vueI18n({
         include: resolve(__dirname, 'src/i18n')
      })
   ],
   resolve: {
      alias: {
         '@app': resolve(__dirname, 'src'),
         '@protocol': resolve(__dirname, '../protocol')
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
   }
})
