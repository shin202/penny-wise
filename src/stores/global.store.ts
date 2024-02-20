import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { ConfirmationOptions } from 'primevue/confirmationoptions'

export const useGlobal = defineStore('global', () => {
  const toast = useToast()
  const confirm = useConfirm()

  const showToastSuccess = (message: string) => {
    toast.add({ severity: 'success', summary: 'Success', detail: message, life: 1500 })
  }

  const showToastError = (message: string) => {
    toast.add({ severity: 'error', summary: 'Error', detail: message, life: 1500 })
  }

  const showToastInfo = (message: string) => {
    toast.add({ severity: 'info', summary: 'Info', detail: message, life: 1500 })
  }

  const showConfirmDialog = (options: ConfirmationOptions) => {
    const {
      group = 'headless',
      message = 'Are you sure?',
      header = 'Confirmation',
      acceptLabel = 'Yes',
      rejectLabel = 'No',
      accept,
      reject = () => showToastInfo('Action cancelled')
    } = options

    confirm.require({
      group,
      message,
      header,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel,
      rejectLabel,
      accept,
      reject
    })
  }

  const showConfirmPopup = (event: any, options: ConfirmationOptions) => {
    confirm.require({
      ...options,
      target: event.currentTarget,
      icon: 'pi pi-question-circle',
      reject: () => showToastInfo('Action cancelled')
    })
  }

  return { showToastSuccess, showToastError, showToastInfo, showConfirmDialog, showConfirmPopup }
})
