<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import _ from 'lodash'
import dayjs from 'dayjs'

import { CsvUtils, currencyFormatter, dateFormatter, getSeverity } from '@/utils'
import { useWallet } from '@/stores/wallet.store'
import Toolbar from 'primevue/toolbar'
import WalletForm from '@/components/WalletForm.vue'

const wallet = useWallet()
const { loadWallets, deleteWallet } = wallet

const { wallets } = storeToRefs(wallet)
const filters = ref()
const walletDialog = ref(false)
const walletFormType = ref('create')
const walletId = ref()

const formattedWallets = computed(() => {
  return wallets.value?.map((wallet) => {
    return {
      ...wallet,
      formattedBalance: currencyFormatter(wallet.balance, wallet.currency.code),
      severity: getSeverity(wallet.status),
      currency: wallet.currency.code,
      image: `${window.location.origin}/api/images/${wallet.image.name}`,
      formattedCreatedAt: dateFormatter(wallet.createdAt),
      createdAt: dayjs(wallet.createdAt).toDate()
    }
  })
})
const selectedWallet = ref(null)
const statuses = ref(['ACTIVE', 'INACTIVE'])
const loading = ref(false)

const setLoading = (value: boolean) => (loading.value = value)

const initFilters = () => {
  filters.value = {
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    name: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.STARTS_WITH
        }
      ]
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.EQUALS
        }
      ]
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.EQUALS
        }
      ]
    },
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.DATE_IS
        }
      ]
    }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const formattedExportData = computed(() => {
  return formattedWallets.value?.map((wallet) => {
    return _.omit(wallet, [
      'formattedBalance',
      'severity',
      'formattedCreatedAt',
      'createdAt',
      'updatedAt'
    ])
  })
})

const exportToCsv = () => {
  const data = formattedExportData.value || []
  CsvUtils.jsonToCsv(data, 'wallets')
}

const onDeleteHandler = (id: number) => {
  deleteWallet(id)
}

const onOpenNewWalletDialog = () => {
  walletFormType.value = 'create'
  walletDialog.value = true
}

const onOpenUpdateWalletDialog = (id: number) => {
  walletFormType.value = 'update'
  walletId.value = id
  walletDialog.value = true
}

const onCloseWalletDialog = () => {
  walletDialog.value = false
}

onBeforeMount(async () => {
  setLoading(true)
  await loadWallets()
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
        @click="onOpenNewWalletDialog"
      />
      <Button label="Delete" icon="pi pi-trash" severity="danger" />
    </template>
    <template #end>
      <Button label="Import" icon="pi pi-upload" class="mr-2" />
      <Button label="Export" icon="pi pi-download" severity="help" />
    </template>
  </Toolbar>
  <DataTable
    :value="formattedWallets"
    v-model:filters="filters"
    v-model:selection="selectedWallet"
    :loading="loading"
    dataKey="id"
    stripedRows
    showGridlines
    removableSort
    scrollable
    scrollHeight="400px"
    filterDisplay="menu"
    :globalFilterFields="['name', 'status']"
    paginator
    :rows="5"
    :rowsPerPageOptions="[5, 15, 30, 50]"
  >
    <template #paginatorstart>
      <Button type="button" icon="pi pi-refresh" text @click="loadWallets" />
    </template>
    <template #header>
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div class="flex gap-4">
          <h1 class="text-lg font-bold">Manage Wallets</h1>
          <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()" />
        </div>
        <div class="relative">
          <i
            class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
          />
          <InputText
            v-model="filters['global'].value"
            placeholder="Keyword Search"
            class="pl-10 font-normal"
          />
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex flex-col items-center justify-center">
        <i class="pi pi-search text-5xl text-surface-400 dark:text-surface-600" />
        <span class="text-xl text-surface-400 dark:text-surface-600">No wallets found.</span>
      </div>
    </template>
    <Column selectionMode="multiple" />
    <Column field="image" header="Image">
      <template #body="{ data }">
        <img :src="data.image" :alt="data.image" class="w-12 h-12 rounded-full" />
      </template>
    </Column>
    <Column field="name" header="Name" :sortable="true">
      <template #body="{ data }">
        <span>{{ data?.name }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" placeholder="Search by name" />
      </template>
    </Column>
    <Column
      field="formattedBalance"
      header="Balance"
      filterField="balance"
      dataType="numeric"
      :sortable="true"
    >
      <template #filter="{ filterModel }">
        <InputNumber
          mode="currency"
          currency="USD"
          locale="en-US"
          v-model="filterModel.value"
          placeholder="Search by balance"
        />
      </template>
    </Column>
    <Column field="status" header="Status" :sortable="true">
      <template #body="{ data }">
        <Tag rounded :value="data.status" class="w-20" :severity="data.severity" />
      </template>
      <template #filter="{ filterModel }">
        <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Select a status">
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
          placeholder="dd/mm/yyyy"
          showTime
          showIcon
          iconDisplay="input"
        />
      </template>
    </Column>
    <Column header="">
      <template #body="{ data }">
        <div class="flex flex-wrap gap-2">
          <Button icon="pi pi-pencil" rounded outlined @click="onOpenUpdateWalletDialog(data.id)" />
          <Button
            icon="pi pi-trash"
            class="p-button-danger"
            severity="danger"
            rounded
            outlined
            @click="onDeleteHandler(data.id)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
  <Dialog v-model:visible="walletDialog" :modal="true" header="Wallet Details">
    <WalletForm :formType="walletFormType" :id="walletId" @cancel="onCloseWalletDialog" />
  </Dialog>
</template>
