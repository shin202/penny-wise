<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import InputGroup from 'primevue/inputgroup'
import Dropdown from 'primevue/dropdown'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'

import CustomFileUpload from '@/components/CustomFileUpload.vue'
import { useImage } from '@/stores/image.store'
import { useCurrency } from '@/stores/currency.store'
import { useWallet } from '@/stores/wallet.store'
import { useWalletHelper } from '@/helpers'

const props = defineProps<{
  formType: 'create' | 'update'
  id?: number
}>()

const emits = defineEmits<{
  (event: 'cancel'): void
}>()

const image = useImage()
const currency = useCurrency()
const wallet = useWallet()
const { loadIcons } = image
const { loadCurrencies } = currency
const { loadWallet } = wallet
const { formValues, isSubmitting, validationErrors, onSubmit, onReset } = useWalletHelper(
  props.formType,
  props.id
)

const { icons } = storeToRefs(image)
const { formattedCurrencies } = storeToRefs(currency)
const { walletDetails } = storeToRefs(wallet)
const maxFileSize = ref<number>(5000000)
const isLoading = ref<boolean>(false)

const currencyCode = computed(() => {
  return formValues.currencyCode?.code || 'USD'
})

const setLoading = (value: boolean) => (isLoading.value = value)

const setWalletDetails = () => {
  formValues.name = walletDetails.value?.name
  formValues.balance = walletDetails.value?.balance
  formValues.currencyCode = formattedCurrencies.value?.find(
    (currency) => currency.code === walletDetails.value?.currency.code
  )
  formValues.description = walletDetails.value?.description
  formValues.imageName = walletDetails.value?.image.name
}

const loadWalletHandler = async () => {
  if (props.formType === 'create') return
  await loadWallet(props.id!)
  setWalletDetails()
}

const loadDataHandler = () => {
  return Promise.all([loadCurrencies(), loadIcons(), loadWalletHandler()])
}

const onUploaded = (imageNames: string[]) => {
  formValues.imageName = imageNames[0]
}

const onCancel = () => {
  emits('cancel')
}

onBeforeMount(async () => {
  setLoading(true)
  await loadDataHandler()
  formValues.currencyCode = formattedCurrencies.value?.[0]
  setLoading(false)
})
</script>

<template>
  <div class="wallet-form">
    <div class="wallet-form__inner">
      <div class="form p-0">
        <div class="form__body mt-0">
          <div class="form__group">
            <label for="name" class="form__label form__label--required">Wallet name</label>
            <InputText
              v-model="formValues.name"
              v-bind="formValues.nameAttrs"
              id="name"
              type="text"
              placeholder="Enter your wallet name"
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
            <label for="balance" class="form__label form__label--required">Balance</label>
            <InputGroup>
              <Dropdown
                v-model="formValues.currencyCode"
                v-bind="formValues.currencyCodeAttrs"
                :options="formattedCurrencies"
                optionLabel="name"
                filter
                class="w-[30%]"
                placeholder="Select a currency"
                id="currency"
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
                v-model="formValues.balance"
                v-bind="formValues.balanceAttrs"
                id="balance"
                placeholder="Enter balance"
                class="form__input"
                mode="currency"
                :currency="currencyCode"
                locale="en-US"
                :disabled="isSubmitting"
              />
            </InputGroup>
            <Transition name="fade">
              <small
                v-if="validationErrors.balance"
                class="form__validation-error"
                id="balance-help"
                v-text="validationErrors.balance"
              />
            </Transition>
          </div>
          <div class="form__group">
            <label for="description" class="form__label form__label--optional">Description</label>
            <Textarea
              v-model="formValues.description"
              v-bind="formValues.descriptionAttrs"
              id="description"
              placeholder="Enter description"
              class="form__input"
              :disabled="isSubmitting"
            />
          </div>
          <div class="form__group">
            <label for="image" class="form__label form__label--required">Image</label>
            <TabView>
              <TabPanel header="Choose an icon">
                <div class="grid grid-cols-4 place-items-center gap-6 space-x-2">
                  <div
                    v-for="icon in icons"
                    :key="icon.id"
                    class="relative w-full aspect-square shadow-md rounded-full"
                  >
                    <input
                      v-model="formValues.imageName"
                      v-bind="formValues.imageNameAttrs"
                      :value="icon.name"
                      :id="`image-${icon.id}`"
                      type="radio"
                      name="image"
                      class="wallet-image__input"
                      :disabled="isSubmitting"
                    />
                    <label :for="`image-${icon.id}`" class="wallet-image__label">
                      <img
                        :src="`/api/images/${icon.name}`"
                        :alt="icon.name"
                        class="absolute w-full h-full object-cover"
                      />
                    </label>
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Upload an image">
                <CustomFileUpload
                  name="image"
                  url="/api/wallets/image"
                  :maxFileSize="maxFileSize"
                  @uploaded="onUploaded"
                />
              </TabPanel>
            </TabView>
            <Transition name="fade">
              <small
                v-if="validationErrors.imageName"
                class="form__validation-error"
                id="image-help"
                v-text="validationErrors.imageName"
              />
            </Transition>
          </div>
          <div class="flex space-x-2 self-end mt-[1rem!important]">
            <Button
              icon="pi pi-times"
              label="Cancel"
              iconPos="right"
              severity="secondary"
              text
              @click="onCancel"
            />
            <Button
              icon="pi pi-refresh"
              iconPos="right"
              label="Reset"
              severity="help"
              @click="onReset"
              :disabled="isSubmitting"
              text
            />
            <Button
              icon="pi pi-check"
              iconPos="right"
              label="Save"
              @click="onSubmit"
              :disabled="isSubmitting"
              :loading="isSubmitting"
              text
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

<style scoped lang="scss">
.wallet-image {
  &__input {
    @apply w-full h-full appearance-none;

    &:checked + .wallet-image__label {
      @apply border-[0.2rem] border-primary-500;
    }
  }

  &__label {
    @apply w-full h-full block cursor-pointer absolute top-0 left-0 rounded-full;

    > img {
      @apply w-full h-full rounded-full object-cover;
    }
  }
}
</style>
