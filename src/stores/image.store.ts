import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IApiResponse, IImage } from '@/common/interfaces'
import { useAuth } from '@/stores/auth.store'
import { ImageService } from '@/services/image.service'

export const useImage = defineStore('image', () => {
  const icons = ref<IImage[]>()
  const auth = useAuth()
  const imageService = new ImageService(auth.accessToken)
  const errMessage = ref<string>('')

  const setIcons = (data: IImage[]) => (icons.value = data)

  const setErrMessage = (message: string = '') => (errMessage.value = message)

  const loadIcons = async () => {
    try {
      const { data } = await imageService.findAllIcons()
      setIcons(data)
    } catch (e) {
      const err = <IApiResponse<any>>e
      const errMessage = err.message || 'Failed to load icons. Please try again later.'
      setErrMessage(errMessage)
      return false
    }

    setErrMessage()
    return true
  }

  return {
    icons,
    errMessage,
    loadIcons
  }
})
