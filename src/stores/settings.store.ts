import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', () => {
  const baseCurrency = ref('VND')

  return {
    baseCurrency
  }
})
