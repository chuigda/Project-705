import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import {initTranslation} from "./util/translation";

initTranslation('zh_cn').then(() => {
   createApp(App).mount('#app')
})
