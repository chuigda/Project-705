import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHashHistory } from 'vue-router'

import { initTranslation } from '@app/util/translation'
import { getLocalStorage } from '@app/util/local_storage'
import makeI18nOption from '@app/i18n'

import App from '@app/app.vue'
import LoginPage from '@app/views/login.vue'
import ErrorPage from '@app/views/error_page.vue'
import GamePlay from '@app/views/game_play.vue'
import ChooseStartup from '@app/views/choose_startup.vue'

import '@app/style.css'
import {dontSink} from '@app/util/emergency'

window.onerror = (message, source, lineno, colno, error) => {
   console.error(`[E] [window.onerror] at file ${source}, line ${source}, col ${colno}: ${message}\n`, error)
   dontSink(`${message}`)
}

const preferredLang = getLocalStorage('lang') || 'zh_cn'

const routes = [
   { path: '/login', component: LoginPage },
   { path: '/gameplay', component: GamePlay },
   { path: '/startup', component: ChooseStartup },
   { path: '/error', component: ErrorPage }
]

export const router = createRouter({ history: createWebHashHistory(), routes })

initTranslation(preferredLang).then(() => {
   const i18n = createI18n(makeI18nOption(preferredLang))
   const app = createApp(App)

   app.use(i18n)
   app.use(router)
   app.mount('#app')
})
