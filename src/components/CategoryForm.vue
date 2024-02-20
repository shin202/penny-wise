<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import RadioButton from 'primevue/radiobutton'
import Dropdown from 'primevue/dropdown'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import CustomFileUpload from '@/components/CustomFileUpload.vue'
import { useImage } from '@/stores/image.store'
import { useCategory } from '@/stores/category.store'
import { useGlobal } from '@/stores/global.store'
import { CreateCategorySchema, UpdateCategorySchema } from '@/common/schemas'
import { CategoryType } from '@/common/constants'
import type { ICategory, IResponse } from '@/common/interfaces'

const props = defineProps<{
  formType: 'create' | 'update'
  id?: number
}>()

const emits = defineEmits<{
  (event: 'cancel'): void
}>()

const router = useRouter()
const { showToastError, showToastSuccess } = useGlobal()
const image = useImage()
const category = useCategory()

const { loadIcons } = image
const { loadCategories, loadCategory, createCategory, updateCategory } = category
const { icons } = storeToRefs(image)
const { categories } = storeToRefs(category)
const maxFileSize = 1000000
const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessages = ref()

const schema = computed(() => {
  return props.formType === 'create' ? CreateCategorySchema : UpdateCategorySchema
})
const validationErrors = computed(() => {
  return {
    name: errors.value.name || errorMessages.value.name,
    description: errors.value.description || errorMessages.value.description,
    type: errors.value.type || errorMessages.value.type,
    parentId: errors.value.parentId || errorMessages.value.parentId,
    imageName: errors.value.imageName || errorMessages.value.imageName
  }
})
const categoriesByType = computed(() => {
  return categories.value?.filter((c) => c.type === type.value)
})

const validationSchema = toTypedSchema(schema.value)
const { handleSubmit, handleReset, errors, defineField } = useForm({
  validationSchema,
  initialValues: {
    type: CategoryType.EXPENSE
  }
})
const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')
const [type, typeAttrs] = defineField('type')
const [parentId, parentIdAttrs] = defineField('parentId')
const [imageName, imageNameAttrs] = defineField('imageName')

const setLoading = (value: boolean) => (isLoading.value = value)

const setSubmitting = (value: boolean) => (isSubmitting.value = value)

const initErrorMessages = () => {
  errorMessages.value = {
    name: '',
    description: '',
    type: '',
    parentId: '',
    imageName: ''
  }
}

initErrorMessages()

const setErrorMessage = (field: string, message: string) => {
  errorMessages.value = {
    ...errorMessages.value,
    [field]: message
  }
}

const setCategory = (category: ICategory) => {
  name.value = category.name
  description.value = category.description
  type.value = category.type
  parentId.value = categoriesByType.value?.find((c) => c.id === category.parent?.id)
  imageName.value = category.image.name
}

const onUploadedHandler = (imageNames: string[]) => {
  imageName.value = imageNames[0]
}

const loadCategoryHandler = async () => {
  if (props.formType === 'create') return

  const { isSuccess, message, data } = await loadCategory(props.id!)

  if (!isSuccess) {
    showToastError(message)
    return
  }

  setCategory(data)
  showToastSuccess(message)
}

const upsertCategoryHandler = (values: any) => {
  switch (props.formType) {
    case 'create':
      return createCategory(values)

    case 'update':
      return updateCategory(props.id!, values)

    default:
      return
  }
}

const upsertResultHandler = (result: IResponse<any>) => {
  const { isSuccess, message, errors } = result

  if (!isSuccess) {
    showToastError(message)
    if (errors) {
      errors.forEach((err) => {
        setErrorMessage(err.property, err.message)
      })
    }
    return
  }

  showToastSuccess(message)
  router.push('/categories')
}

const onSubmitHandler = handleSubmit(async (values) => {
  setSubmitting(true)
  const result = await upsertCategoryHandler(values)
  upsertResultHandler(result!)
  emits('cancel')
  setSubmitting(false)
})

const onResetHandler = () => {
  handleReset()
  initErrorMessages()
}

const onCancelHandler = () => {
  emits('cancel')
}

const onCategoryTypeChange = () => {
  console.log('onCategoryTypeChange')
  parentId.value = null
}

onBeforeMount(async () => {
  setLoading(true)
  await loadCategories()
  await loadIcons()
  await loadCategoryHandler()
  setLoading(false)
})
</script>

<template>
  <div class="category-form">
    <div class="category-form__inner">
      <div class="form p-0">
        <div class="form__body mt-0">
          <img
            v-if="imageName"
            :src="`/api/images/${imageName}`"
            :alt="imageName"
            class="block mb-4 w-full aspect-square rounded-full border-2 border-primary-500 shadow-inner"
          />
          <div class="form__group">
            <label for="name" class="form__label form__label--required">Name</label>
            <InputText
              v-model="name"
              v-bind="nameAttrs"
              id="name"
              type="text"
              placeholder="Enter category name"
              class="form__input"
              autocomplete="on"
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
            <label for="description" class="form__label form__label--optional">Description</label>
            <Textarea
              v-model="description"
              v-bind="descriptionAttrs"
              id="description"
              placeholder="Enter category description"
              class="form__input"
              :disabled="isSubmitting"
            />
            <Transition name="fade">
              <small
                v-if="validationErrors.description"
                class="form__validation-error"
                id="description-help"
                v-text="validationErrors.description"
              />
            </Transition>
          </div>
          <div class="flex items-center flex-wrap gap-2 md:gap-10 md:space-x-4">
            <div class="form__group">
              <span class="form__label form__label--required">Type</span>
              <div class="flex flex-wrap gap-3">
                <div class="flex items-center">
                  <RadioButton
                    v-model="type"
                    v-bind="typeAttrs"
                    inputId="type-expense"
                    name="type"
                    :value="CategoryType.EXPENSE"
                    :disabled="isSubmitting"
                    @input="onCategoryTypeChange"
                  />
                  <label for="type-expense" class="ml-2">Expense</label>
                </div>
                <div class="flex items-center">
                  <RadioButton
                    v-model="type"
                    v-bind="typeAttrs"
                    inputId="type-income"
                    name="type"
                    :value="CategoryType.INCOME"
                    :disabled="isSubmitting"
                    @input="onCategoryTypeChange"
                  />
                  <label for="type-income" class="ml-2">Income</label>
                </div>
              </div>
              <Transition name="fade">
                <small
                  v-if="validationErrors.type"
                  class="form__validation-error"
                  id="type-help"
                  v-text="validationErrors.type"
                />
              </Transition>
            </div>
            <div class="form__group">
              <span class="form__label form__label--optional">Parent</span>
              <Dropdown
                v-model="parentId"
                v-bind="parentIdAttrs"
                :options="categoriesByType"
                optionLabel="name"
                filter
                placeholder="Select parent category"
                class="form__input"
                :disabled="isSubmitting"
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
                  v-if="validationErrors.parentId"
                  class="form__validation-error"
                  id="parent-help"
                  v-text="validationErrors.parentId"
                />
              </Transition>
            </div>
          </div>
          <div class="form__group">
            <span class="form__label form__label--required">Image</span>
            <TabView>
              <TabPanel header="Choose an icon">
                <div class="grid grid-cols-4 place-items-center gap-6 space-x-2">
                  <div
                    v-for="icon in icons"
                    :key="icon.id"
                    class="relative w-full aspect-square shadow-md rounded-full"
                  >
                    <input
                      v-model="imageName"
                      v-bind="imageNameAttrs"
                      :value="icon.name"
                      :id="`image-${icon.id}`"
                      type="radio"
                      name="image"
                      class="category-image__input"
                    />
                    <label :for="`image-${icon.id}`" class="category-image__label">
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
                  url="/api/categories/image"
                  :maxFileSize="maxFileSize"
                  @uploaded="onUploadedHandler"
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
              @click="onResetHandler"
              :disabled="isSubmitting"
              text
            />
            <Button
              icon="pi pi-check"
              iconPos="right"
              label="Save"
              class="w-20"
              @click="onSubmitHandler"
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
.category-image {
  &__input {
    @apply w-full h-full appearance-none;

    &:checked + .category-image__label {
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
