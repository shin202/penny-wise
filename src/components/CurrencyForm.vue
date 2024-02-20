<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { useCurrency } from '@/stores/currency.store'
import { storeToRefs } from 'pinia'
import { useCurrencyHelper } from '@/helpers'

const props = defineProps<{
  formType: 'create' | 'update'
  id?: number
}>()

const emits = defineEmits<{
  (event: 'cancel'): void
}>()

const currency = useCurrency()
const { formValues, isSubmitting, validationErrors, onSubmitHandler, onResetHandler } =
  useCurrencyHelper(props.formType, props.id)
const { loadCurrency } = currency
const { currencyDetails } = storeToRefs(currency)
const isLoading = ref(false)

const setLoading = (value: boolean) => (isLoading.value = value)

const setCurrencyDetails = () => {
  formValues.name = currencyDetails.value?.name
  formValues.namePlural = currencyDetails.value?.namePlural
  formValues.symbol = currencyDetails.value?.symbol
  formValues.code = currencyDetails.value?.code
  formValues.decimalDigits = currencyDetails.value?.decimalDigits
  formValues.rounding = currencyDetails.value?.rounding
}

const loadCurrencyHandler = async () => {
  if (props.formType === 'create') return
  setLoading(true)
  await loadCurrency(props.id!)
  setCurrencyDetails()
  setLoading(false)
}

const onCodeInputHandler = () => {
  formValues.code = formValues.code?.toUpperCase()
}

const onCancelHandler = () => {
  emits('cancel')
}

onBeforeMount(async () => {
  await loadCurrencyHandler()
})
</script>

<template>
  <div class="create-currency-form">
    <div class="create-currency-form__inner">
      <div class="form p-0">
        <div class="form__body mt-0">
          <div class="form__group">
            <label for="name" class="form__label form__label--required">Name</label>
            <InputText
              v-model="formValues.name"
              v-bind="formValues.nameAttrs"
              id="name"
              type="text"
              placeholder="Enter currency name"
              class="form__input"
              autofocus
              :disabled="isSubmitting"
            />
            <Transition name="fade">
              <small
                v-if="validationErrors.name"
                class="form__validation-error"
                id="name-help"
                v-text="validationErrors.name"
              />
            </Transition>
          </div>
          <div class="form__group">
            <label for="name-plural" class="form__label form__label--required">Name plural</label>
            <InputText
              v-model="formValues.namePlural"
              v-bind="formValues.namePluralAttrs"
              id="name-plural"
              type="text"
              placeholder="Enter currency plural name"
              class="form__input"
              :disabled="isSubmitting"
            />
            <Transition name="fade">
              <small
                v-if="validationErrors.namePlural"
                class="form__validation-error"
                id="name-plural-help"
                v-text="validationErrors.namePlural"
              />
            </Transition>
          </div>
          <div class="flex flex-wrap gap-3">
            <div class="form__group">
              <label for="symbol" class="form__label form__label--required">Symbol</label>
              <InputText
                v-model="formValues.symbol"
                v-bind="formValues.symbolAttrs"
                id="symbol"
                type="text"
                placeholder="Enter currency symbol"
                class="form__input"
                minlength="1"
                maxlength="5"
                :disabled="isSubmitting"
              />
              <Transition name="fade">
                <small
                  v-if="validationErrors.symbol"
                  class="form__validation-error"
                  id="symbol-help"
                  v-text="validationErrors.symbol"
                />
              </Transition>
            </div>
            <div class="form__group">
              <label for="code" class="form__label form__label--required">Code</label>
              <InputText
                v-model="formValues.code"
                v-bind="formValues.codeAttrs"
                id="code"
                type="text"
                placeholder="Enter currency code"
                class="form__input"
                minlength="3"
                maxlength="3"
                @input="onCodeInputHandler"
                :disabled="isSubmitting"
              />
              <Transition name="fade">
                <small
                  v-if="validationErrors.code"
                  class="form__validation-error"
                  id="code-help"
                  v-text="validationErrors.code"
                />
              </Transition>
            </div>
            <div class="form__group">
              <label for="decimal-digits" class="form__label form__label--required"
                >Decimal digits</label
              >
              <InputNumber
                v-model="formValues.decimalDigits"
                v-bind="formValues.decimalDigitsAttrs"
                id="decimal-digits"
                placeholder="Enter currency dd"
                class="form__input"
                :disabled="isSubmitting"
              />
              <Transition name="fade">
                <small
                  v-if="validationErrors.decimalDigits"
                  class="form__validation-error"
                  id="decimal-digits-help"
                  v-text="validationErrors.decimalDigits"
                />
              </Transition>
            </div>
            <div class="form__group">
              <label for="rounding" class="form__label form__label--required">Rounding</label>
              <InputNumber
                v-model="formValues.rounding"
                v-bind="formValues.roundingAttrs"
                id="rounding"
                placeholder="Enter currency rounding"
                class="form__input"
                :disabled="isSubmitting"
              />
              <Transition name="fade">
                <small
                  v-if="validationErrors.rounding"
                  class="form__validation-error"
                  id="rounding-help"
                  v-text="validationErrors.rounding"
                />
              </Transition>
            </div>
          </div>
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
              :disabled="isSubmitting"
              @click="onResetHandler"
            />
            <Button
              icon="pi pi-check"
              iconPos="right"
              label="Save"
              class="w-20"
              text
              @click="onSubmitHandler"
              :disabled="isSubmitting"
              :loading="isSubmitting"
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

<style scoped lang="scss"></style>
