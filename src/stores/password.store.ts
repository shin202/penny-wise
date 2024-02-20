import { defineStore } from 'pinia'
import type { ForgotPasswordDto } from '@/common/schemas'
import { PasswordService } from '@/services/password.service'
import { useGlobal } from '@/stores/global.store'
import { ref } from 'vue'

export const usePassword = defineStore('password', () => {
  const { showToastError } = useGlobal()
  const isEmailSent = ref(false)

  const setEmailSentStatus = (status: boolean) => (isEmailSent.value = status)

  const forgotPassword = async (forgotPasswordDto: ForgotPasswordDto) => {
    try {
      await PasswordService.forgot(forgotPasswordDto)
      setEmailSentStatus(true)
    } catch (e) {
      showToastError('Oops! Something went wrong. Please try again.')
    }
  }

  return {
    isEmailSent,
    forgotPassword
  }
})
