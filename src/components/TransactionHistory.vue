<script setup lang="ts">
import { useWallet } from '@/stores/wallet.store'
import { useCurrency } from '@/stores/currency.store'
import { useCategory } from '@/stores/category.store'
import { useTransaction } from '@/stores/transaction.store'
import { useExpense } from '@/stores/expense.store'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, ref } from 'vue'
import { CsvUtils, currencyFormatter, dateFormatter } from '@/utils'
import type { ICategory, IFindTransaction } from '@/common/interfaces'
import { Order, TransactionType } from '@/common/constants'
import DataView, { type DataViewPageEvent } from 'primevue/dataview'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import Toolbar from 'primevue/toolbar'
import Skeleton from 'primevue/skeleton'
import Dropdown from 'primevue/dropdown'
import TieredMenu from 'primevue/tieredmenu'
import TransactionForm from '@/components/TransactionForm.vue'

const wallet = useWallet()
const currency = useCurrency()
const category = useCategory()
const transaction = useTransaction()
const { deleteExpense } = useExpense()

const { loadWallets } = wallet
const { loadCurrencies } = currency
const { loadCategories } = category
const { loadTransactions } = transaction
const { wallets } = storeToRefs(wallet)
const { formattedCurrencies } = storeToRefs(currency)
const { categories } = storeToRefs(category)
const { transactionWithPagination } = storeToRefs(transaction)
const transactionTypes = Object.entries(TransactionType).map(([key, value]) => ({
  name: key,
  value
}))

const tieredMenu = ref<TieredMenu>()
const tieredMenuItems = ref([
  {
    label: 'New Expense',
    icon: 'pi pi-chart-line',
    command: () => onOpenNewExpenseDialog()
  },
  {
    label: 'New Income',
    icon: 'pi pi-dollar',
    command: () => onOpenNewIncomeDialog()
  }
])
const loading = ref(true)

const dateRange = ref<Date[]>([])
const selectedTransactionType = ref()
const selectedWallet = ref()
const selectedCurrency = ref()
const selectedCategory = ref()
const currentPage = ref(0)
const perPage = ref(10)
const rowsPerPageOptions = [3, 10, 20, 50]

const transactionFormType = ref('create')
const transactionType = ref('expense')
const transactionDialog = ref(false)
const transactionId = ref()

const transactionDialogHeader = computed(() => {
  return transactionType.value === 'expense' ? 'Expense Details' : 'Income Details'
})
const transactions = computed(() => transactionWithPagination.value?.transactions)
const pagination = computed(() => transactionWithPagination.value?.meta)

const date = computed(() => {
  if (dateRange.value?.[0] && !dateRange.value?.[1]) {
    return dateRange.value[0]
  }

  return undefined
})
const startDate = computed(() => dateRange.value?.[0])
const endDate = computed(() => dateRange.value?.[1])
const formattedCategories = computed(() => {
  const formatted: ICategory[] = []
  const categoriesByType = selectedTransactionType.value
    ? categories.value?.filter((category) => category.type === selectedTransactionType.value)
    : categories.value

  categoriesByType?.map((category) => {
    formatted.push(category)
    category.children?.map((child) => formatted.push(child))
  })

  return formatted
})
const formattedTransactions = computed(() => {
  return transactions.value?.map((transaction) => {
    const category = findCategory(transaction.category.id)
    const amountPrefix = transaction.transactionType === TransactionType.EXPENSE ? '-' : '+'
    const formattedAmount = currencyFormatter(transaction.amount, transaction.currency.code)
    const amount = `${amountPrefix}${formattedAmount}`
    const transactionDate = dateFormatter(transaction.transactionDate)

    return {
      ...transaction,
      category,
      amount,
      transactionDate
    }
  })
})

const disabledClear = computed(() => {
  return (
    dateRange.value.length === 0 &&
    !selectedWallet.value &&
    !selectedCurrency.value &&
    !selectedCategory.value &&
    !selectedTransactionType.value
  )
})

const setLoading = (value: boolean) => (loading.value = value)

const onPageChange = (e: DataViewPageEvent) => {
  currentPage.value = e.page + 1
  perPage.value = e.rows
  filterTransactions()
}

const filterTransactions = async () => {
  setLoading(true)
  const filterParams: IFindTransaction = {
    type: selectedTransactionType.value,
    date: date.value,
    startDate: !date.value ? startDate.value : undefined,
    endDate: !date.value ? endDate.value : undefined,
    category: selectedCategory.value?.id,
    wallet: selectedWallet.value,
    currency: selectedCurrency.value?.id,
    order: {
      transactionDate: Order.DESC
    },
    page: currentPage.value || 1,
    limit: perPage.value
  }

  await loadTransactions(filterParams, true)
  setLoading(false)
}

const clearFilter = () => {
  dateRange.value = []
  selectedWallet.value = null
  selectedCurrency.value = null
  selectedCategory.value = null
  selectedTransactionType.value = null
  filterTransactions()
}

const onChangeTransactionType = () => {
  selectedCategory.value = null
  filterTransactions()
}

const loadData = () => {
  return Promise.all([
    loadWallets(),
    loadCurrencies(),
    loadCategories(),
    loadTransactions({
      type: selectedTransactionType.value,
      order: {
        transactionDate: Order.DESC
      }
    })
  ])
}

const findCategory = (id: number) => {
  const category = formattedCategories.value?.find((category) => category.id === id)
  return {
    ...category,
    image: {
      name: category?.image.name,
      url: `/api/images/${category?.image.name}`
    }
  }
}

const onOpenTieredMenu = (e: any) => {
  tieredMenu.value?.toggle(e)
}

const onOpenNewExpenseDialog = () => {
  transactionFormType.value = 'create'
  transactionType.value = 'expense'
  transactionDialog.value = true
}

const onOpenNewIncomeDialog = () => {
  transactionFormType.value = 'create'
  transactionType.value = 'income'
  transactionDialog.value = true
}

const onOpenUpdateTransactionDialog = (id: number, type: TransactionType) => {
  transactionFormType.value = 'update'
  transactionType.value = type
  transactionId.value = id
  transactionDialog.value = true
}

const onCloseTransactionDialog = () => {
  transactionDialog.value = false
  transactionId.value = undefined
}

const exportToCSV = () => {
  const data = formattedTransactions.value?.map((transaction) => {
    return {
      id: transaction.transactionId,
      category: transaction.category?.name,
      wallet: transaction.wallet?.name,
      amount: transaction.amount,
      type: transaction.transactionType,
      transactionDate: transaction.transactionDate
    }
  })

  const datePrefix =
    dateRange.value.length === 1
      ? dateFormatter(date.value!)
      : dateRange.value.length === 2
        ? `${dateFormatter(startDate.value)}-${dateFormatter(endDate.value)}`
        : 'all-time'

  const transactionTypePrefix = selectedTransactionType.value
    ? selectedTransactionType.value.toLowerCase()
    : 'transaction'

  const filename = `${datePrefix}_${transactionTypePrefix}`
  CsvUtils.jsonToCsv(data, filename)
}

onBeforeMount(async () => {
  setLoading(true)
  await loadData()
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
        @click="onOpenTieredMenu"
      />
      <TieredMenu ref="tieredMenu" :model="tieredMenuItems" popup />
      <Button label="Delete" icon="pi pi-trash" severity="danger" />
      <Button
        icon="pi pi-filter-slash"
        class="ml-2"
        :disabled="disabledClear"
        outlined
        @click="clearFilter"
      />
      <Button
        icon="pi pi-refresh"
        class="ml-2"
        severity="info"
        outlined
        @click="filterTransactions"
      />
    </template>
    <template #center>
      <Calendar
        v-model="dateRange"
        dateFormat="dd/mm/yy"
        placeholder="All times"
        showIcon
        iconDisplay="input"
        selectionMode="range"
        :manualInput="false"
        @dateSelect="filterTransactions"
      />
    </template>
    <template #end>
      <Button label="Import" icon="pi pi-upload" class="mr-2" />
      <Button label="Export" icon="pi pi-download" severity="help" @click="exportToCSV" />
    </template>
  </Toolbar>
  <DataView
    :value="formattedTransactions"
    dataKey="id"
    paginator
    :totalRecords="pagination?.itemCount"
    :rowsPerPageOptions="rowsPerPageOptions"
    v-model:rows="perPage"
    @page="onPageChange"
    :lazy="true"
  >
    <template #header>
      <div class="flex flex-wrap gap-4 justify-between">
        <div class="flex flex-wrap gap-4 justify-between items-center">
          <Dropdown
            v-model="selectedTransactionType"
            :options="transactionTypes"
            optionLabel="name"
            optionValue="value"
            placeholder="All types"
            @change="onChangeTransactionType"
          />
          <Dropdown
            v-model="selectedWallet"
            :options="wallets"
            optionLabel="name"
            optionValue="id"
            placeholder="All wallets"
            @change="filterTransactions"
          />
          <Dropdown
            v-model="selectedCurrency"
            :options="formattedCurrencies"
            placeholder="All currencies"
            @change="filterTransactions"
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
                <img :src="slotProps.option.flag" :alt="slotProps.option.label" class="w-6 h-4" />
                <span v-text="slotProps.option.code" />
              </div>
            </template>
          </Dropdown>
        </div>
        <Dropdown
          v-model="selectedCategory"
          :options="formattedCategories"
          placeholder="All categories"
          @change="filterTransactions"
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
      </div>
    </template>
    <template #list="{ items }">
      <div v-if="!loading" class="flex flex-col gap-6 p-4 divide-y divide-surface-200">
        <div
          v-for="item in items"
          :key="item.transactionId"
          class="flex flex-col justify-center pt-1.5"
        >
          <div class="flex items-center gap-4">
            <div class="w-24 aspect-square relative">
              <img
                class="absolute w-full h-full object-cover rounded-full shadow-md border-2 border-primary-500"
                :src="item.category.image.url"
                :alt="item.category.image.name"
              />
            </div>
            <div class="flex flex-col justify-center self-start flex-grow">
              <span class="font-medium text-base md:text-lg" v-text="item.category.name" />
              <span
                class="font-medium text-surface-500 md:text-sm"
                v-text="`Wallet: ${item.wallet.name}`"
              />
            </div>
            <div class="flex flex-col gap-2 items-center justify-center">
              <div>
                <Button
                  icon="pi pi-pencil"
                  rounded
                  outlined
                  class="mr-2"
                  @click="onOpenUpdateTransactionDialog(item.transactionId, item.transactionType)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  rounded
                  outlined
                  @click="deleteExpense(item.transactionId)"
                />
              </div>
              <span
                class="text-base md:text-lg ml-auto"
                :class="
                  item.transactionType === TransactionType.EXPENSE
                    ? 'text-red-500'
                    : 'text-primary-500'
                "
                v-text="item.amount"
              />
            </div>
          </div>
          <span
            class="font-light text-surface-500 ml-auto md:text-sm"
            v-text="item.transactionDate"
          />
        </div>
      </div>
      <div v-else class="flex flex-col gap-6 p-4 divide-y divide-surface-200">
        <div v-for="i in 5" :key="i" class="flex flex-col justify-center pt-1 5">
          <div class="flex items-center gap-4">
            <div>
              <Skeleton shape="circle" size="6rem" />
            </div>
            <div class="flex flex-col justify-center self-start flex-grow gap-2">
              <Skeleton width="4rem" height="0.8rem" />
              <Skeleton width="5rem" height="0.8rem" />
            </div>
            <div class="flex flex-col gap-2 items-center justify-center">
              <div class="flex gap-2">
                <Skeleton shape="circle" size="2rem" />
                <Skeleton shape="circle" size="2rem" />
              </div>
              <Skeleton width="5rem" />
            </div>
          </div>
          <Skeleton width="8rem" height="0.8rem" class="ml-auto" />
        </div>
      </div>
    </template>
    <template #empty>
      <div v-if="loading" class="flex flex-col gap-6 p-4 divide-y divide-surface-200">
        <div v-for="i in 5" :key="i" class="flex flex-col justify-center pt-1 5">
          <div class="flex items-center gap-4">
            <div>
              <Skeleton shape="circle" size="6rem" />
            </div>
            <div class="flex flex-col justify-center self-start flex-grow gap-2">
              <Skeleton width="4rem" height="0.8rem" />
              <Skeleton width="5rem" height="0.8rem" />
            </div>
            <div class="flex flex-col gap-2 items-center justify-center">
              <div class="flex gap-2">
                <Skeleton shape="circle" size="2rem" />
                <Skeleton shape="circle" size="2rem" />
              </div>
              <Skeleton width="5rem" />
            </div>
          </div>
          <Skeleton width="8rem" height="0.8rem" class="ml-auto" />
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center p-4">
        <i class="pi pi-search text-5xl text-surface-400 dark:text-surface-600" />
        <span class="text-xl text-surface-400 dark:text-surface-600"> No transactions found. </span>
      </div>
    </template>
    <template #paginatorstart>
      <div class="hidden md:flex md:items-center gap-4">
        <span
          class="text-surface-500 text-sm"
          v-text="`Showing ${pagination?.itemCount} transactions`"
        />
        <span
          class="text-surface-500 text-sm"
          v-text="
            `(${pagination?.pageCount !== 0 ? pagination?.currentPage : 0} of ${pagination?.pageCount})`
          "
        />
      </div>
    </template>
  </DataView>
  <Dialog v-model:visible="transactionDialog" :header="transactionDialogHeader" :modal="true">
    <TransactionForm
      :formType="transactionFormType"
      :transactionType="transactionType"
      :id="transactionId"
      @cancel="onCloseTransactionDialog"
    />
  </Dialog>
</template>
