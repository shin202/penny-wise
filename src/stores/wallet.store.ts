import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuth } from '@/stores/auth.store'
import type { IWallet } from '@/common/interfaces'
import { WalletService } from '@/services/wallet.service'
import { ApiResponseHandlerUtils } from '@/utils'
import type { CreateWalletDto } from 'src/common/schemas'
import { useGlobal } from '@/stores/global.store'

export const useWallet = defineStore('wallet', () => {
  const { showToastSuccess, showToastError, showConfirmDialog } = useGlobal()
  const auth = useAuth()
  const walletService = new WalletService(auth.accessToken)
  const wallets = ref<IWallet[]>()
  const walletDetails = ref<IWallet>()

  const setWallets = (data: IWallet[]) => (wallets.value = data)

  const setWalletDetails = (data: IWallet) => (walletDetails.value = data)

  const loadWallets = async () => {
    try {
      const { data } = await walletService.findAll()
      setWallets(data)
    } catch (e: any) {
      return ApiResponseHandlerUtils.errorHandler(
        e,
        'Failed to load wallets. Please try again later.'
      )
    }

    return ApiResponseHandlerUtils.successHandler('Wallets loaded successfully.')
  }

  const loadWallet = async (id: number) => {
    try {
      const { data, message } = await walletService.findOne(id)
      setWalletDetails(data)
      showToastSuccess(message)
    } catch (e: any) {
      showToastError('Failed to load wallet. Please try again later.')
    }
  }

  const createWallet = async (createWalletDto: CreateWalletDto) => {
    try {
      const { data, message } = await walletService.create(createWalletDto)
      wallets.value?.push(data)
      showToastSuccess(message)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      showToastError('Failed to create wallet. Please try again later.')
      return ApiResponseHandlerUtils.errorHandler(e)
    }
  }

  const updateWallet = async (id: number, updateWalletDto: CreateWalletDto) => {
    try {
      const { message } = await walletService.update(id, updateWalletDto)
      showToastSuccess(message)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      showToastError('Failed to update wallet. Please try again later.')
      return ApiResponseHandlerUtils.errorHandler(e)
    }
  }

  const deleteWallet = (id: number) => {
    showConfirmDialog({
      message: 'Are you sure you want to delete this wallet?',
      header: 'Delete Wallet?',
      accept: () => onAcceptDeleteWallet(id),
      acceptLabel: 'Yes',
      rejectLabel: 'Cancel'
    })
  }

  const onAcceptDeleteWallet = async (id: number) => {
    try {
      const { message } = await walletService.delete(id)
      wallets.value = wallets.value?.filter((wallet) => wallet.id !== id)
      showToastSuccess(message)
    } catch (e) {
      showToastError('Failed to delete wallet. Please try again later.')
    }
  }

  return {
    wallets,
    walletDetails,
    loadWallets,
    loadWallet,
    createWallet,
    updateWallet,
    deleteWallet
  }
})
