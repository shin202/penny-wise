import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CreateUserDto, LoginCredentialsDto } from 'src/common/schemas'
import { AuthService } from '@/services/auth.service'
import { ApiResponseHandlerUtils } from '@/utils'
import { useGlobal } from '@/stores/global.store'

export const useAuth = defineStore(
  'auth',
  () => {
    const { showToastSuccess, showConfirmDialog } = useGlobal()
    const accessToken = ref<string>('')
    const isAuthenticated = computed(() => !!accessToken.value)

    const setAccessToken = (token: string) => {
      accessToken.value = token
    }

    const login = async (loginCredentials: LoginCredentialsDto) => {
      try {
        const {
          data: { accessToken },
          message
        } = await AuthService.login(loginCredentials)
        setAccessToken(accessToken)

        return ApiResponseHandlerUtils.successHandler(message)
      } catch (e: any) {
        return ApiResponseHandlerUtils.errorHandler(e)
      }
    }

    const register = async (createUserDto: CreateUserDto) => {
      try {
        const { message } = await AuthService.register(createUserDto)
        return ApiResponseHandlerUtils.successHandler(message)
      } catch (e: any) {
        return ApiResponseHandlerUtils.errorHandler(e)
      }
    }

    const logout = async () => {
      showConfirmDialog({
        group: 'logout',
        message: 'Are you sure you want to logout?',
        header: 'Logout?',
        acceptLabel: 'Logout now',
        rejectLabel: 'Cancel',
        accept: () => onAcceptLogout()
      })
    }

    const onAcceptLogout = async () => {
      await AuthService.logout(accessToken.value)
      setAccessToken('')
      showToastSuccess('You have been successfully logged out.')
    }

    return {
      accessToken,
      isAuthenticated,
      setAccessToken,
      login,
      register,
      logout
    }
  },
  {
    persist: {
      paths: ['accessToken']
    }
  }
)
