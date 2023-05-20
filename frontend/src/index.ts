import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import App from '@app/app.vue'
import ErrorPage from '@app/views/error_page.vue'
import GamePlay from '@app/views/game_play.vue'
import ChooseStartup from '@app/views/choose_startup.vue'
import TestPage from '@app/views/test_page.vue'

import '@app/style.css'
import '@app/color.css'
import { dontSink } from '@app/util/emergency'


window.onerror = (message, source, lineno, colno, error) => {
   console.error(`[E] [window.onerror] 在文件 ${source}, 行 ${lineno}, 列 ${colno} 遇到错误: ${message}\n`, error)
   dontSink(`${message}`)
}

const routes = [
   { path: '/gameplay', component: GamePlay },
   { path: '/startup', component: ChooseStartup },
   { path: '/error', component: ErrorPage },
   { path: '/test_page', component: TestPage }
]

export const router = createRouter({ history: createWebHashHistory(), routes })

createApp(App)
   .use(router)
   .mount('#app')
