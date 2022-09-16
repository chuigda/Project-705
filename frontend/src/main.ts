import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from '@app/app.vue'
import { initTranslation } from '@app/util/translation'
import { getLocalStorage } from '@app/util/localStorage'
import makeI18nOption from '@app/i18n'

import '@app/style.css'

const preferredLang = getLocalStorage('lang') || 'zh_cn'

initTranslation(preferredLang).then(() => {
   const i18n = createI18n(makeI18nOption(preferredLang))
   const app = createApp(App)
   // 看起来 tsc 遇到了 stackoverflow，天下无敌的 TypeScript 就这？
   // @ts-ignore
   app.use(i18n)
   app.mount('#app')
})
