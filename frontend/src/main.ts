import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import { initTranslation } from "./util/translation"
import { getLocalStorage } from "./util/localStorage"

const preferredLang = getLocalStorage('lang') || 'zh_cn'

initTranslation(preferredLang).then(() => createApp(App).mount('#app'))
