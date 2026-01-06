import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
const app = createApp(App)

// 注入 BASE_URL 到 Vue 实例
app.config.globalProperties.$baseUrl = import.meta.env.BASE_URL

app.use(createPinia())
app.use(router)
app.mount('#app')