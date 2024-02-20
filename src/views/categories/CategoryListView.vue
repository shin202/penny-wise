<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'

import Toolbar from 'primevue/toolbar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import { useConfirm } from 'primevue/useconfirm'
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import _ from 'lodash'

import { useCategory } from '@/stores/category.store'
import { CsvUtils, dateFormatter } from '@/utils'
import dayjs from 'dayjs'
import CategoryForm from '@/components/CategoryForm.vue'
import { useGlobal } from '@/stores/global.store'
import { CategoryType } from '@/common/constants'

const confirm = useConfirm()
const { showToastError, showToastSuccess, showToastInfo } = useGlobal()
const category = useCategory()

const { loadCategories, deleteCategory } = category
const { categories } = storeToRefs(category)
const filters = ref()
const categoryTypes = ref(['expense', 'income'])
const expandedRows = ref([])
const loading = ref(false)
const categoryFormType = ref('create')
const categoryDialog = ref(false)
const categoryId = ref()

const formattedCategories = computed(() => {
  return categories.value?.map((category) => {
    return {
      ...category,
      image: `${window.location.origin}/api/images/${category.image.name}`,
      severity: getSeverity(category.type),
      createdAt: dayjs(category.createdAt).toDate(),
      formattedCreatedAt: dateFormatter(category.createdAt),
      children: category.children?.map((child) => {
        return {
          ...child,
          image: `${window.location.origin}/api/images/${child.image.name}`,
          severity: getSeverity(child.type),
          createdAt: dayjs(child.createdAt).toDate(),
          formattedCreatedAt: dateFormatter(child.createdAt)
        }
      })
    }
  })
})

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    type: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
    }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const setLoading = (value: boolean) => (loading.value = value)

const getSeverity = (type: string) => {
  return type === CategoryType.EXPENSE ? 'danger' : undefined
}

const onOpenNewCategory = () => {
  categoryFormType.value = 'create'
  categoryDialog.value = true
}

const onOpenEditCategory = (id: number) => {
  categoryFormType.value = 'update'
  categoryId.value = id
  categoryDialog.value = true
}

const onHideCategoryDialog = () => {
  categoryDialog.value = false
}

const onAcceptDelete = async (id: number) => {
  const { isSuccess, message } = await deleteCategory(id)
  if (!isSuccess) {
    showToastError(message)
    return
  }
  showToastSuccess(message)
}

const onDeleteCategory = (id: number) => {
  confirm.require({
    group: 'headless',
    message: 'Are you sure you want to delete this category?',
    header: 'Dangerous Action',
    icon: 'pi pi-exclamation-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => onAcceptDelete(id),
    reject: () => showToastInfo('Delete action cancelled')
  })
}

const exportToCsv = () => {
  const data =
    formattedCategories.value?.map((category) => {
      return _.omit(category, [
        'formattedCreatedAt',
        'createdAt',
        'updatedAt',
        'severity',
        'children'
      ])
    }) || []
  CsvUtils.jsonToCsv(data, 'categories')
}

onBeforeMount(async () => {
  setLoading(true)
  await loadCategories()
  setLoading(false)
})
</script>

<template>
  <div class="">
    <Toolbar>
      <template #start>
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          class="mr-2"
          @click="onOpenNewCategory"
        />
        <Button label="Delete" icon="pi pi-trash" severity="danger" />
      </template>
      <template #end>
        <Button label="Import" icon="pi pi-upload" class="mr-2" />
        <Button label="Export" icon="pi pi-download" severity="help" @click="exportToCsv" />
      </template>
    </Toolbar>
    <DataTable
      :value="formattedCategories"
      v-model:filters="filters"
      :expandedRows="expandedRows"
      :loading="loading"
      filterDisplay="menu"
      :globalFilterFields="['name']"
      dataKey="id"
      scrollable
      scrollHeight="400px"
      showGridlines
      removableSort
      resizableColumns
      columnResizeMode="expand"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 15, 30, 50]"
    >
      <template #header>
        <div class="flex flex-wrap justify-between items-center gap-4">
          <div class="flex gap-4">
            <h1 class="text-lg font-bold">Manage Categories</h1>
            <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter" />
          </div>
          <div class="flex gap-4">
            <span class="relative">
              <i
                class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
              />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
                class="pl-10 font-normal"
              />
            </span>
          </div>
        </div>
      </template>
      <Column expander style="width: 5rem" />
      <Column field="name" header="Name" :sortable="true">
        <template #body="{ data }">
          <div class="flex items-center">
            <div class="relative w-12 aspect-square">
              <img
                :src="data.image"
                :alt="data.image"
                class="absolute object-fit w-full h-full rounded-full"
              />
            </div>
            <span class="ml-2" v-text="data.name" />
          </div>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" placeholder="Search by name" />
        </template>
      </Column>
      <Column field="type" header="Type" :sortable="true">
        <template #body="{ data }">
          <Tag rounded :value="data.type" class="w-20" :severity="data.severity" />
        </template>
        <template #filter="{ filterModel }">
          <Dropdown
            v-model="filterModel.value"
            :options="categoryTypes"
            placeholder="Select a type"
          >
            <template #option="slotProps">
              <Tag
                rounded
                :value="slotProps.option"
                class="w-20"
                :severity="getSeverity(slotProps.option)"
              />
            </template>
          </Dropdown>
        </template>
      </Column>
      <Column
        field="formattedCreatedAt"
        header="Created At"
        filterField="createdAt"
        dataType="date"
        :sortable="true"
      >
        <template #filter="{ filterModel }">
          <Calendar
            v-model="filterModel.value"
            dateFormat="dd/mm/yy"
            placeholder="Filter by created at"
            showIcon
            iconDisplay="input"
          />
        </template>
      </Column>
      <Column header="">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-2">
            <Button icon="pi pi-pencil" outlined rounded @click="onOpenEditCategory(data.id)" />
            <Button
              icon="pi pi-trash"
              severity="danger"
              outlined
              rounded
              @click="onDeleteCategory(data.id)"
            />
          </div>
        </template>
      </Column>
      <template #expansion="{ data }">
        <div class="">
          <h5 class="text-sm font-medium">Child categories of {{ data?.name }}</h5>
          <DataTable :value="data?.children" dataKey="id" removableSort>
            <Column field="name" header="Name" :sortable="true">
              <template #body="{ data }">
                <div class="relative w-12 aspect-square">
                  <img
                    :src="data.image"
                    :alt="data.image"
                    class="absolute object-fit w-full h-full rounded-full"
                  />
                </div>
                <span class="ml-2" v-text="data.name" />
              </template>
            </Column>
            <Column field="type" header="Type" :sortable="true">
              <template #body="{ data }">
                <Tag rounded :value="data.type" class="w-20" :severity="data.severity" />
              </template>
            </Column>
            <Column field="formattedCreatedAt" header="Created At" :sortable="true" />
            <Column header="">
              <template #body="{ data }">
                <div class="flex flex-wrap gap-2">
                  <Button
                    icon="pi pi-pencil"
                    outlined
                    rounded
                    @click="onOpenEditCategory(data.id)"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    rounded
                    @click="onDeleteCategory(data.id)"
                  />
                </div>
              </template>
            </Column>
            <template #empty>
              <div class="flex flex-col items-center justify-center">
                <i class="pi pi-search text-5xl text-surface-400 dark:text-surface-600" />
                <span class="text-xl text-surface-400 dark:text-surface-600"
                  >No child categories found.</span
                >
              </div>
            </template>
          </DataTable>
        </div>
      </template>
      <template #empty>
        <div class="flex flex-col items-center justify-center">
          <i class="pi pi-search text-5xl text-surface-400 dark:text-surface-600" />
          <span class="text-xl text-surface-400 dark:text-surface-600">No categories found.</span>
        </div>
      </template>
      <template #paginatorstart>
        <Button icon="pi pi-refresh" text />
      </template>
    </DataTable>
    <Dialog v-model:visible="categoryDialog" header="Category Details" :modal="true">
      <CategoryForm :formType="categoryFormType" :id="categoryId" @cancel="onHideCategoryDialog" />
    </Dialog>
  </div>
</template>

<style scoped lang="scss"></style>
