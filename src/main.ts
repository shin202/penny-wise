import './assets/styles/_main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Ripple from 'primevue/ripple'
import Wind from '@/assets/presets/wind';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  unstyled: true,
  pt: Wind,
  ripple: true,
})
app.directive('ripple', Ripple)

app.mount('#app')
