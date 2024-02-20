import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAuth } from '@/stores/auth.store'
import type { ICurrency } from '@/common/interfaces'
import { CurrencyService } from '@/services/currency.service'
import { ApiResponseHandlerUtils, dateFormatter, getFlag } from '@/utils'
import type { CreateCurrencyDto, UpdateCurrencyDto } from 'src/common/schemas'
import { useGlobal } from '@/stores/global.store'
import dayjs from 'dayjs'

export const useCurrency = defineStore('currency', () => {
  const { showToastSuccess, showToastError } = useGlobal()
  const auth = useAuth()
  const currencyService = new CurrencyService(auth.accessToken)
  const currencies = ref<ICurrency[]>()
  const currencyDetails = ref<ICurrency>()

  const formattedCurrencies = computed(() => {
    return currencies.value?.map((currency) => ({
      ...currency,
      createdAt: dayjs(currency.createdAt).toDate(),
      formattedCreatedAt: dateFormatter(currency.createdAt),
      flag: new URL(`../assets/images/flags/${getFlag(currency.code)}.png`, import.meta.url).href
    }))
  })

  const setCurrencies = (data: ICurrency[]) => (currencies.value = data)

  const setCurrencyDetails = (data: ICurrency) => (currencyDetails.value = data)

  const loadCurrencies = async () => {
    try {
      const { data } = await currencyService.findAll()
      setCurrencies(data)
    } catch (e) {
      return ApiResponseHandlerUtils.errorHandler(
        e,
        'Failed to load currencies. Please try again later.'
      )
    }

    return ApiResponseHandlerUtils.successHandler('Currencies loaded successfully.')
  }

  const loadCurrency = async (id: number) => {
    try {
      const { data, message } = await currencyService.findOne(id)
      setCurrencyDetails(data)
      showToastSuccess(message)
    } catch (e) {
      showToastError('Failed to load currency. Please try again later.')
    }
  }

  const createCurrency = async (createCurrencyDto: CreateCurrencyDto) => {
    try {
      const { message } = await currencyService.create(createCurrencyDto)
      showToastSuccess(message)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      showToastError('Failed to create currency. Please try again later.')
      return ApiResponseHandlerUtils.errorHandler(e)
    }
  }

  const updateCurrency = async (id: number, updateCurrencyDto: UpdateCurrencyDto) => {
    try {
      const { message } = await currencyService.update(id, updateCurrencyDto)
      showToastSuccess(message)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      showToastError('Failed to update currency. Please try again later.')
      return ApiResponseHandlerUtils.errorHandler(e)
    }
  }

  const deleteCurrency = async (id: number) => {
    try {
      const { message } = await currencyService.delete(id)
      currencies.value = currencies.value?.filter((currency) => currency.id !== id)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      return ApiResponseHandlerUtils.errorHandler(
        e,
        'Failed to delete currency. Please try again later.'
      )
    }
  }

  return {
    currencies,
    formattedCurrencies,
    currencyDetails,
    loadCurrencies,
    loadCurrency,
    createCurrency,
    updateCurrency,
    deleteCurrency
  }
})
