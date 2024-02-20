<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useRafFn } from '@vueuse/core'
import Toolbar from 'primevue/toolbar'
import Dropdown from 'primevue/dropdown'
import SelectButton from 'primevue/selectbutton'
import { Bar, Doughnut, Line } from 'vue-chartjs'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  PointElement,
  LineElement
} from 'chart.js'

import { useWallet } from '@/stores/wallet.store'
import { useStats } from '@/stores/stats.store'
import { currencyFormatter } from '@/utils'
import { DateUtils } from '@/utils/date.utils'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
)

const wallet = useWallet()
const stats = useStats()
const { loadWallets } = wallet
const {
  loadSummaryStats,
  loadTotalBalanceStats,
  loadLastSevenDaysExpense,
  loadLastSevenDaysIncome
} = stats

const { wallets } = storeToRefs(wallet)
const { summaryStats, totalBalanceStats, lastSevenDaysExpense, lastSevenDaysIncome } =
  storeToRefs(stats)
const transactionCount = ref(0)
const totalExpense = ref(0)
const totalIncome = ref(0)
const totalBalance = ref(0)
const selectedWallet = ref()
const selectedChartType = ref('bar')
const chartTypes = ref([
  { label: 'Bar', value: 'bar' },
  { label: 'Line', value: 'line' }
])

const formattedTotalExpense = computed(() => {
  return currencyFormatter(totalExpense.value, summaryStats.value.expenseTransaction.currencyCode)
})
const formattedTotalIncome = computed(() => {
  return currencyFormatter(totalIncome.value, summaryStats.value.incomeTransaction.currencyCode)
})
const formattedTotalBalance = computed(() => {
  return currencyFormatter(totalBalance.value, totalBalanceStats.value.currencyCode)
})
const overviewCards = computed(() => {
  return [
    {
      label: 'Transactions',
      value: transactionCount.value,
      icon: 'pi pi-chart-line',
      color: 'text-blue-500'
    },
    {
      label: 'Incomes',
      value: formattedTotalIncome.value,
      icon: 'pi pi-dollar',
      color: 'text-green-500'
    },
    {
      label: 'Expenses',
      value: formattedTotalExpense.value,
      icon: 'pi pi-money-bill',
      color: 'text-red-500'
    },
    {
      label: 'Balance',
      value: formattedTotalBalance.value,
      icon: 'pi pi-wallet',
      color: 'text-purple-500'
    }
  ]
})
const expenseByDate = computed(() => {
  return lastSevenDaysExpense.value.amountByDate
})
const expenseByCategory = computed(() => {
  return lastSevenDaysExpense.value.amountByCategory
})
const incomeByDate = computed(() => {
  return lastSevenDaysIncome.value.amountByDate
})
const incomeByCategory = computed(() => {
  return lastSevenDaysIncome.value.amountByCategory
})
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: selectedChartType.value === 'bar' ? 'y' : 'x'
  }
})
const transactionByDateChart = computed(() => {
  return {
    labels: DateUtils.lastSevenDays,
    datasets: [
      {
        label: `Expense`,
        data: expenseByDate.value.map((i) => i.amount),
        fill: false,
        backgroundColor: ['rgba(255, 99, 132, 1)']
      },
      {
        label: `Income`,
        data: incomeByDate.value.map((i) => i.amount),
        fill: false,
        backgroundColor: ['rgba(54, 162, 235, 1)']
      }
    ]
  }
})
const expenseByCategoryChart = computed(() => {
  return {
    labels: expenseByCategory.value.map((i) => i.name),
    datasets: [
      {
        data: expenseByCategory.value.map((i) => i.amount),
        fill: false,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ]
      }
    ]
  }
})
const incomeByCategoryChart = computed(() => {
  return {
    labels: incomeByCategory.value.map((i) => i.name),
    datasets: [
      {
        data: incomeByCategory.value.map((i) => i.amount),
        fill: false,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ]
      }
    ]
  }
})

const transactionCounter = () => {
  if (transactionCount.value < summaryStats.value.transactionCount) {
    const increment = Math.ceil(summaryStats.value.transactionCount / 150)
    if (transactionCount.value + increment > summaryStats.value.transactionCount) {
      transactionCount.value = summaryStats.value.transactionCount
    } else {
      transactionCount.value += increment
    }
  }
}

const totalExpenseCounter = () => {
  if (totalExpense.value < summaryStats.value.expenseTransaction.totalAmount) {
    const increment = Math.ceil(summaryStats.value.expenseTransaction.totalAmount / 150)
    if (totalExpense.value + increment > summaryStats.value.expenseTransaction.totalAmount) {
      totalExpense.value = summaryStats.value.expenseTransaction.totalAmount
    } else {
      totalExpense.value += increment
    }
  }
}

const totalIncomeCounter = () => {
  if (totalIncome.value < summaryStats.value.incomeTransaction.totalAmount) {
    const increment = Math.ceil(summaryStats.value.incomeTransaction.totalAmount / 150)
    if (totalIncome.value + increment > summaryStats.value.incomeTransaction.totalAmount) {
      totalIncome.value = summaryStats.value.incomeTransaction.totalAmount
    } else {
      totalIncome.value += increment
    }
  }
}

const totalBalanceCounter = () => {
  if (totalBalance.value < totalBalanceStats.value.totalBalance) {
    const increment = Math.ceil(totalBalanceStats.value.totalBalance / 150)
    if (totalBalance.value + increment > totalBalanceStats.value.totalBalance) {
      totalBalance.value = totalBalanceStats.value.totalBalance
    } else {
      totalBalance.value += increment
    }
  }
}

useRafFn(
  () => {
    transactionCounter()
    totalExpenseCounter()
    totalIncomeCounter()
    totalBalanceCounter()
  },
  {
    immediate: true
  }
)

const filterExpense = async () => {
  await loadLastSevenDaysExpense({
    wallet: selectedWallet.value
  })
}

const filterIncome = async () => {
  await loadLastSevenDaysIncome({
    wallet: selectedWallet.value
  })
}

const filterTransaction = () => {
  return Promise.all([filterExpense(), filterIncome()])
}

const loadData = () => {
  return Promise.all([
    loadWallets(),
    loadSummaryStats(),
    loadTotalBalanceStats(),
    filterTransaction()
  ])
}

onBeforeMount(async () => {
  await loadData()
})
</script>

<template>
  <div class="flex items-center">
    <div class="w-10 h-10 rounded-full bg-surface-0 flex items-center justify-center">
      <i class="pi pi-chart-bar text-xl" />
    </div>
    <span class="text-3xl ml-2">Overview</span>
  </div>
  <div class="mt-6 grid md:grid-cols-2 gap-5">
    <div
      v-for="i in overviewCards"
      :key="i.label"
      class="flex flex-col bg-surface-0 p-6 flex-1 rounded-md gap-2"
    >
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <span class="text-lg text-surface-500" v-text="i.label" />
          <span class="text-3xl font-semibold" v-text="i.value" />
        </div>
        <i class="text-4xl" :class="[i.icon, i.color]" />
      </div>
    </div>
  </div>
  <Toolbar class="mt-4">
    <template #start>
      <Dropdown
        v-model="selectedWallet"
        :options="wallets"
        optionLabel="name"
        optionValue="id"
        placeholder="All wallets"
        @change="filterTransaction"
      />
    </template>
  </Toolbar>
  <div class="grid gap-4 md:grid-cols-2 mt-6 mb-4">
    <div class="bg-surface-0 px-6 py-12 shadow-md rounded-md flex flex-col">
      <SelectButton
        v-model="selectedChartType"
        :options="chartTypes"
        optionLabel="label"
        optionValue="value"
      />
      <span class="text-center text-surface-500 py-1.5 font-semibold">Transaction by date</span>
      <div class="flex-1">
        <Bar
          v-if="selectedChartType === 'bar'"
          :data="transactionByDateChart"
          :options="chartOptions"
        />
        <Line
          v-else-if="selectedChartType === 'line'"
          :data="transactionByDateChart"
          :options="chartOptions"
        />
      </div>
    </div>
    <div
      class="bg-surface-0 px-6 py-12 shadow-md rounded-md grid md:grid-cols-2 gap-4 items-center"
    >
      <div class="flex flex-col">
        <span class="text-center text-surface-500 py-1.5 font-semibold">Expense by category</span>
        <div class="">
          <Doughnut :data="expenseByCategoryChart" :options="chartOptions" />
        </div>
      </div>
      <div class="flex flex-col">
        <span class="text-center text-surface-500 py-1.5 font-semibold">Income by category</span>
        <div class="">
          <Doughnut :data="incomeByCategoryChart" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
