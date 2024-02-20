import './assets/styles/_main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Ripple from 'primevue/ripple'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import PiniaPluginPersist from 'pinia-plugin-persistedstate'

import Wind from '@/assets/presets/wind'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()

pinia.use(PiniaPluginPersist)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  unstyled: true,
  pt: Wind,
  ripple: true
})
app.use(ToastService)
app.use(ConfirmationService)
app.directive('ripple', Ripple)

app.mount('#app')
