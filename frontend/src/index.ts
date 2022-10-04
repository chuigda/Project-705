import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHashHistory } from 'vue-router'

import { initTranslation } from '@app/util/translation'
import { getLocalStorage } from '@app/util/local_storage'
import makeI18nOption from '@app/i18n'

import App from '@app/app.vue'
import Main from '@app/views/main.vue'
import ChooseStartup from '@app/views/choose_startup.vue'

import '@app/style.css'

const preferredLang = getLocalStorage('lang') || 'zh_cn'

const routes = [
   { path: '/', component: Main },
   { path: '/startup', component: ChooseStartup },
]

// Why there are tons of stack overflows in TSC created by fucking noob TypeScript kiddies?
// @ts-ignore
const router = createRouter({ history: createWebHashHistory(), routes })

initTranslation(preferredLang).then(() => {
   const i18n = createI18n(makeI18nOption(preferredLang))
   const app = createApp(App)

   // @ts-ignore
   app.use(i18n)
   // @ts-ignore
   app.use(router)
   app.mount('#app')
})
