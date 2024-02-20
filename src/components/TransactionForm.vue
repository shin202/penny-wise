<script setup lang="ts">
import InputGroup from 'primevue/inputgroup'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import CustomFileUpload from '@/components/CustomFileUpload.vue'
import { useWallet } from '@/stores/wallet.store'
import { useCategory } from '@/stores/category.store'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, ref } from 'vue'
import { useCurrency } from '@/stores/currency.store'
import dayjs from 'dayjs'
import { useExpense } from '@/stores/expense.store'
import { useIncome } from '@/stores/income.store'
import { useTransactionHelper } from '@/helpers'

const props = defineProps<{
  transactionType: 'income' | 'expense'
  formType: 'create' | 'update'
  id?: number
}>()

const emits = defineEmits<{
  (event: 'cancel'): void
}>()

const currency = useCurrency()
const wallet = useWallet()
const category = useCategory()
const expense = useExpense()
const income = useIncome()
const { formValues, isSubmitting, validationErrors, onSubmitHandler, onResetHandler } =
  useTransactionHelper(props.formType, props.transactionType, props.id)

const { loadExpense } = expense
const { loadIncome } = income
const { loadCurrencies } = currency
const { loadWallets } = wallet
const { loadCategories } = category
const { formattedCurrencies } = storeToRefs(currency)
const { wallets } = storeToRefs(wallet)
const isLoading = ref(false)

const isExpense = computed(() => props.transactionType === 'expense')
const isIncome = computed(() => props.transactionType === 'income')
const categoryByTypes = computed(() => {
  return isExpense.value ? category.expenseCategories : category.incomeCategories
})
const transactionDetails = computed(() => {
  return isExpense.value ? expense.expenseDetails : income.incomeDetails
})
const currencyCode = computed(() => {
  return formattedCurrencies.value?.find((c) => c.id === formValues.currencyId?.id)?.code || 'USD'
})

const setLoading = (value: boolean) => (isLoading.value = value)

const setTransactionDetails = () => {
  formValues.walletId = wallets.value?.find((w) => w.id === transactionDetails.value?.wallet.id)
  formValues.currencyId = formattedCurrencies.value?.find(
    (c) => c.id === transactionDetails.value?.currency.id
  )
  formValues.categoryId = categoryByTypes.value?.find(
    (c) => c.id === transactionDetails.value?.category.id
  )
  formValues.amount = transactionDetails.value?.amount
  formValues.transactionDate = dayjs(transactionDetails.value?.transactionDate).toDate()
  formValues.notes = transactionDetails.value?.notes
}

const loadTransaction = async () => {
  if (props.formType === 'create') return

  isExpense.value && (await loadExpense(props.id!))
  isIncome.value && (await loadIncome(props.id!))
  setTransactionDetails()
}

const onCancelHandler = () => {
  emits('cancel')
}

const loadData = () => {
  return Promise.all([loadCurrencies(), loadWallets(), loadCategories(), loadTransaction()])
}

onBeforeMount(async () => {
  setLoading(true)
  await loadData()
  formValues.currencyId = formattedCurrencies.value?.[0]
  setLoading(false)
})
</script>

<template>
  <div class="transaction-form">
    <div class="transaction-form__inner">
      <div class="form p-0">
        <div class="form__body mt-0">
          <div class="form__group">
            <span class="form__label">Amount</span>
            <InputGroup>
              <Dropdown
                v-model="formValues.currencyId"
                v-bind="formValues.currencyIdAttrs"
                :options="formattedCurrencies"
                filter
                optionLabel="name"
                placeholder="Select a currency"
                :disabled="isSubmitting"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-2">
                    <img :src="slotProps.value.flag" :alt="slotProps.value.label" class="w-6 h-4" />
                    <span v-text="slotProps.value.code" />
                  </div>
                  <span v-else v-text="slotProps.placeholder" />
                </template>
                <template #option="slotProps">
                  <div class="flex items-center gap-2">
                    <img
                      :src="slotProps.option.flag"
                      :alt="slotProps.option.label"
                      class="w-6 h-4"
                    />
                    <span v-text="slotProps.option.code" />
                  </div>
                </template>
              </Dropdown>
              <InputNumber
                v-model="formValues.amount"
                v-bind="formValues.amountAttrs"
                :disabled="isSubmitting"
                class="form__input"
                placeholder="Enter amount"
                :minFractionDigits="0"
                :maxFractionDigits="2"
                mode="currency"
                :currency="currencyCode"
                currencyDisplay="symbol"
                locale="en-US"
                autofocus
              />
            </InputGroup>
            <Transition name="fade">
              <small
                v-if="validationErrors.amount"
                v-text="validationErrors.amount"
                class="form__validation-error"
                id="amount-help"
              />
            </Transition>
          </div>
          <div class="flex items-center flex-wrap gap-2">
            <div class="form__group flex-1">
              <span class="form__label">Wallet</span>
              <Dropdown
                v-model="formValues.walletId"
                v-bind="formValues.walletIdAttrs"
                :options="wallets"
                :disabled="isSubmitting"
                placeholder="Select a wallet"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-2">
                    <img
                      :src="`/api/images/${slotProps.value.image.name}`"
                      :alt="slotProps.value.label"
                      class="w-6 h-4 object-cover"
                    />
                    <span v-text="slotProps.value.name" />
                  </div>
                  <span v-else v-text="slotProps.placeholder" />
                </template>
                <template #option="slotProps">
                  <div class="flex items-center gap-2">
                    <img
                      :src="`/api/images/${slotProps.option.image.name}`"
                      :alt="slotProps.option.label"
                      class="w-6 h-4 object-cover"
                    />
                    <span v-text="slotProps.option.name" />
                  </div>
                </template>
              </Dropdown>
              <Transition name="fade">
                <small
                  v-if="validationErrors.walletId"
                  v-text="validationErrors.walletId"
                  class="form__validation-error"
                  id="wallet-help"
                />
              </Transition>
            </div>
            <div class="form__group flex-1">
              <span class="form__label">Category</span>
              <Dropdown
                v-model="formValues.categoryId"
                v-bind="formValues.categoryIdAttrs"
                :options="categoryByTypes"
                :disabled="isSubmitting"
                placeholder="Select a category"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-2">
                    <img
                      :src="`/api/images/${slotProps.value.image.name}`"
                      :alt="slotProps.value.label"
                      class="w-6 h-4 object-cover"
                    />
                    <span v-text="slotProps.value.name" />
                  </div>
                  <span v-else v-text="slotProps.placeholder" />
                </template>
                <template #option="slotProps">
                  <div class="flex items-center gap-2">
                    <img
                      :src="`/api/images/${slotProps.option.image.name}`"
                      :alt="slotProps.option.label"
                      class="w-6 h-4"
                    />
                    <span v-text="slotProps.option.name" />
                  </div>
                </template>
              </Dropdown>
              <Transition name="fade">
                <small
                  v-if="validationErrors.categoryId"
                  v-text="validationErrors.categoryId"
                  class="form__validation-error"
                  id="category-help"
                />
              </Transition>
            </div>
          </div>
          <div class="form__group">
            <span class="form__label form__label--optional">Notes</span>
            <Textarea
              v-model="formValues.notes"
              v-bind="formValues.notesAttrs"
              class="form__input"
              placeholder="Enter notes"
            />
            <Transition name="fade">
              <small
                v-if="validationErrors.notes"
                v-text="validationErrors.notes"
                class="form__validation-error"
                id="notes-help"
              />
            </Transition>
          </div>
          <div class="form__group">
            <span class="form__label">Transaction date</span>
            <Calendar
              v-model="formValues.transactionDate"
              v-bind="formValues.transactionDateAttrs"
              :disabled="isSubmitting"
              dateFormat="dd/mm/yy"
              showIcon
              showTime
              iconDisplay="input"
              class="form__input"
              placeholder="Select a date"
            />
            <Transition name="fade">
              <small
                v-if="validationErrors.transactionDate"
                v-text="validationErrors.transactionDate"
                class="form__validation-error"
                id="transaction-date-help"
              />
            </Transition>
          </div>
          <Accordion>
            <AccordionTab header="Advanced">
              <div class="form__group">
                <span class="form__label form__label--optional">Images</span>
                <CustomFileUpload
                  v-bind="formValues.imageNamesAttrs"
                  name="images"
                  url="/api/expenses/image"
                />
                <Transition name="fade">
                  <small
                    v-if="validationErrors.imageNames"
                    v-text="validationErrors.imageNames"
                    class="form__validation-error"
                    id="images-help"
                  />
                </Transition>
              </div>
            </AccordionTab>
          </Accordion>
          <div class="flex space-x-2 self-end mt-[1rem!important]">
            <Button
              icon="pi pi-times"
              iconPos="right"
              label="Cancel"
              severity="secondary"
              text
              @click="onCancelHandler"
            />
            <Button
              icon="pi pi-refresh"
              iconPos="right"
              label="Reset"
              severity="help"
              class="w-20"
              text
              @click="onResetHandler"
            />
            <Button
              icon="pi pi-check"
              iconPos="right"
              label="Save"
              class="w-20"
              text
              @click="onSubmitHandler"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isLoading" class="w-full h-full absolute bg-surface-200/50 top-0 left-0">
    <i
      class="pi pi-spin pi-spinner text-2xl absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
    />
  </div>
</template>
