<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Toolbar from 'primevue/toolbar'
import Dialog from 'primevue/dialog'
import { useConfirm } from 'primevue/useconfirm'
import { FilterMatchMode, FilterOperator } from 'primevue/api'

import { CsvUtils } from '@/utils'
import { useCurrency } from '@/stores/currency.store'
import { useGlobal } from '@/stores/global.store'
import CurrencyForm from '@/components/CurrencyForm.vue'

const confirm = useConfirm()
const { showToastError, showToastSuccess, showToastInfo } = useGlobal()
const currency = useCurrency()
const { loadCurrencies } = currency

const { formattedCurrencies } = storeToRefs(currency)
const selectedCurrency = ref()
const filters = ref()
const loading = ref(true)
const currencyDialog = ref(false)
const currencyFormType = ref('create')
const currencyId = ref()

const setLoading = (value: boolean) => (loading.value = value)

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
    },
    code: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    symbol: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    rounding: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    decimalDigits: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const exportToCSV = () => {
  const data = formattedCurrencies.value || []
  CsvUtils.jsonToCsv(data, 'currencies')
}

const onAcceptDelete = async (id: number) => {
  const { isSuccess, message } = await currency.deleteCurrency(id)
  if (!isSuccess) {
    showToastError(message)
    return
  }
  showToastSuccess(message)
}

const onDeleteHandler = (id: number) => {
  confirm.require({
    group: 'headless',
    message: 'Are you sure you want to delete this currency?',
    header: 'Dangerous Action',
    icon: 'pi pi-exclamation-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => onAcceptDelete(id),
    reject: () => showToastInfo('Delete action cancelled.')
  })
}

const onOpenNewCurrencyDialog = () => {
  currencyFormType.value = 'create'
  currencyDialog.value = true
}

const onOpenUpdateCurrencyDialog = (id: number) => {
  currencyFormType.value = 'update'
  currencyId.value = id
  currencyDialog.value = true
}

const onCloseCurrencyDialog = () => {
  currencyDialog.value = false
}

onBeforeMount(async () => {
  setLoading(true)
  await loadCurrencies()
  setLoading(false)
})
</script>

<template>
  <Toolbar>
    <template #start>
      <Button
        label="New"
        icon="pi pi-plus"
        severity="success"
        class="mr-2"
        @click="onOpenNewCurrencyDialog"
      />
      <Button label="Delete" icon="pi pi-trash" severity="danger" />
    </template>
    <template #end>
      <Button label="Import" icon="pi pi-upload" class="mr-2" />
      <Button label="Export" icon="pi pi-download" severity="help" />
    </template>
  </Toolbar>
  <DataTable
    v-model:filters="filters"
    :value="formattedCurrencies"
    v-model:selection="selectedCurrency"
    dataKey="id"
    :loading="loading"
    filterDisplay="menu"
    stripedRows
    showGridlines
    removableSort
    scrollable
    scrollHeight="400px"
    :resizableColumns="true"
    columnResizeMode="expand"
    paginator
    :rows="5"
    :rowsPerPageOptions="[5, 15, 30, 50]"
  >
    <template #paginatorstart>
      <Button type="button" icon="pi pi-refresh" text @click="loadCurrencies" />
    </template>
    <template #header>
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div class="flex gap-4">
          <h1 class="text-lg font-bold">Manage Currencies</h1>
          <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()" />
        </div>
        <div class="flex gap-4">
          <span class="relative">
            <i
              class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
            />
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
              class="pl-10 font-normal"
            />
          </span>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex flex-col items-center justify-center">
        <i class="pi pi-search text-5xl text-surface-400 dark:text-surface-600" />
        <span class="text-xl text-surface-400 dark:text-surface-600">No currencies found.</span>
      </div>
    </template>
    <Column selectionMode="multiple" />
    <Column field="name" header="Name" filterField="name" :sortable="true">
      <template #body="{ data }">
        <div class="flex flex-wrap items-center gap-2">
          <img :src="data.flag" :alt="data.name" class="w-8 h-6" />
          <span v-text="data.name" />
        </div>
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          type="text"
          class="p-column-filter"
          placeholder="Search by name"
        />
      </template>
    </Column>
    <Column field="code" header="Code" filterField="code" :sortable="true">
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by code" />
      </template>
    </Column>
    <Column field="symbol" header="Symbol" filterField="symbol" :sortable="true">
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by symbol" />
      </template>
    </Column>
    <Column field="rounding" header="Rounding" filterField="rounding" :sortable="true">
      <template #filter="{ filterModel }">
        <InputNumber
          v-model="filterModel.value"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          placeholder="Search by rounding"
        />
      </template>
    </Column>
    <Column
      field="decimalDigits"
      header="Decimal Digits"
      filterField="decimalDigits"
      :sortable="true"
    >
      <template #filter="{ filterModel }">
        <InputNumber
          v-model="filterModel.value"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          placeholder="Search by decimal digits"
        />
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
          dateFormat="dd/mm/yy"
          placeholder="dd/mm/yyyy"
          showTime
          showIcon
          iconDisplay="input"
          v-model="filterModel.value"
        />
      </template>
    </Column>
    <Column header="">
      <template #body="{ data }">
        <div class="flex flex-wrap gap-2">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            @click="onOpenUpdateCurrencyDialog(data.id)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-danger"
            severity="danger"
            outlined
            rounded
            @click="onDeleteHandler(data.id)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
  <Dialog v-model:visible="currencyDialog" :modal="true" header="Currency Details">
    <CurrencyForm :formType="currencyFormType" :id="currencyId" @cancel="onCloseCurrencyDialog" />
  </Dialog>
</template>

<style scoped lang="scss"></style>
