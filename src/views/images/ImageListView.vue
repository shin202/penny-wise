<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'

import DataView from 'primevue/dataview'
import Button from 'primevue/button'
import ContextMenu from 'primevue/contextmenu'

import { useImage } from '@/stores/image.store'

const image = useImage()

const { icons, errMessage } = storeToRefs(image)
const loading = ref(false)
const contextMenu = ref<ContextMenu>()
const contextMenuItems = ref([
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      console.log('Delete', selectedIcon.value)
    }
  }
])
const selectedIcon = ref()

const setLoading = (value: boolean) => (loading.value = value)

const onImageRightClick = (event: any, id: number) => {
  contextMenu.value?.show(event)
  selectedIcon.value = id
}

onBeforeMount(async () => {
  setLoading(true)
  await image.loadIcons()
  setLoading(false)
})
</script>

<template>
  <DataView :value="icons" :paginator="true" :rows="10">
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Icons</h1>
        <RouterLink to="/images/new">
          <Button icon="pi pi-plus" label="New Icon" />
        </RouterLink>
      </div>
    </template>
    <template #list="slotProps">
      <div class="grid grid-cols-6 md:grid-cols-12 gap-4 py-4 px-6">
        <div v-for="item in slotProps.items" :key="item.id">
          <div class="relative w-full aspect-square flex flex-col items-center justify-center">
            <img
              :src="`/api/images/${item.name}`"
              :alt="item.name"
              class="absolute w-full h-full rounded-full object-cover shadow-md border-2 border-primary-500"
              @contextmenu="onImageRightClick($event, item.id)"
            />
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex flex-col items-center justify-center py-4">
        <i class="pi pi-search text-5xl text-surface-400 dark:text-surface-600" />
        <span class="text-xl text-surface-400 dark:text-surface-600">No icons found.</span>
      </div>
    </template>
  </DataView>
  <ContextMenu ref="contextMenu" :model="contextMenuItems" />
</template>

<style scoped lang="scss"></style>
