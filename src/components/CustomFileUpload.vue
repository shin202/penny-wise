<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Badge from 'primevue/badge'
import FileUpload, {
  type FileUploadBeforeSendEvent,
  type FileUploadErrorEvent,
  type FileUploadProgressEvent,
  type FileUploadUploadEvent
} from 'primevue/fileupload'

import { useAuth } from '@/stores/auth.store'
import { useGlobal } from '@/stores/global.store'

const props = withDefaults(
  defineProps<{
    name: string
    url: string
    multiple?: boolean
    maxFileSize?: number
  }>(),
  {
    multiple: false,
    maxFileSize: 10000000
  }
)

const emits = defineEmits<{
  (event: 'uploaded', imageNames: string[]): void
}>()

const { showToastError, showToastSuccess } = useGlobal()
const auth = useAuth()

const { accessToken } = storeToRefs(auth)
const uploadProgress = ref<number>(0)
const fileLimit = computed(() => (props.multiple ? 5 : 1))

const setUploadProgress = (progress: number) => (uploadProgress.value = progress)

const onBeforeSend = (event: FileUploadBeforeSendEvent) => {
  const request = event.xhr
  request.setRequestHeader('Authorization', `Bearer ${accessToken.value}`)
}

const onUpload = (event: FileUploadUploadEvent) => {
  const imageNames: string[] = []

  const request = event.xhr
  const response = JSON.parse(request.response || '{}')

  if (Array.isArray(response.data)) {
    response.data.forEach((image: any) => {
      imageNames.push(image.name)
    })
  } else {
    imageNames.push(response.data.name)
  }

  showToastSuccess('Image uploaded successfully')

  emits('uploaded', imageNames)
}

const onError = (event: FileUploadErrorEvent) => {
  const request = event.xhr
  const response = JSON.parse(request.response || '{}')
  const errMessage = response.message || 'Failed to upload image. Please try again later.'

  showToastError(errMessage)

  setUploadProgress(0)
}

const onProgress = (event: FileUploadProgressEvent) => {
  const progressEvent = event.originalEvent as ProgressEvent
  const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
  setUploadProgress(progress)
}
</script>

<template>
  <FileUpload
    :pt="{
      root: 'flex flex-col space-y-4 bg-surface-0 rounded p-4',
      input: 'hidden',
      buttonbar: 'flex flex-wrap justify-between items-center flex-1 gap-2',
      file: 'm-0 px-6 py-4 flex flex-col items-center border border-surface-200 rounded gap-3',
      content: 'flex flex-wrap justify-center items-center gap-5 mt-1',
      thumbnail: 'w-60 h-60',
      details: 'flex flex-col items-center gap-2'
    }"
    :url="props.url"
    :name="props.name"
    :multiple="props.multiple"
    :maxFileSize="props.maxFileSize"
    accept="image/*"
    :fileLimit="fileLimit"
    @beforeSend="onBeforeSend"
    @progress="onProgress"
    @upload="onUpload"
    @error="onError"
  >
    <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
      <div class="flex space-x-2">
        <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined></Button>
        <Button
          icon="pi pi-cloud-upload"
          rounded
          outlined
          severity="success"
          :disabled="!files || files.length === 0"
          @click="uploadCallback()"
        ></Button>
        <Button
          @click="clearCallback()"
          icon="pi pi-times"
          rounded
          outlined
          severity="danger"
          :disabled="!files || files.length === 0"
        ></Button>
      </div>
      <ProgressBar class="w-full md:w-[20rem]" showValue :value="uploadProgress" />
    </template>
    <template #content="{ files, removeFileCallback }">
      <div v-if="files.length > 0" class="flex flex-col w-full">
        <h5 class="font-bold self-start">Pending</h5>
        <div class="flex flex-wrap gap-5 mt-1">
          <div
            v-for="(file, index) of files"
            :key="`${file.name}${file.type}${file.size}`"
            class="m-0 px-6 py-4 flex flex-col items-center border border-surface-200 rounded gap-3"
          >
            <div>
              <img
                role="presentation"
                :src="file.objectURL"
                :alt="file.name"
                width="250"
                height="250"
              />
            </div>
            <span v-text="file.name" />
            <Badge value="Pending" severity="warning" />
            <Button
              @click="removeFileCallback(index)"
              icon="pi pi-times"
              rounded
              outlined
              severity="danger"
            />
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex items-center justify-center flex-col">
        <i
          class="pi pi-cloud-upload border-2 p-5 text-8xl text-surface-400 rounded-full border-surface-400"
        />
        <p class="mt-4">Drag and drop files to here to upload</p>
      </div>
    </template>
  </FileUpload>
</template>

<style scoped lang="scss"></style>
