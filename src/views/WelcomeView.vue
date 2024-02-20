<script setup lang="ts">
import { ref, shallowRef } from 'vue'

import Card from 'primevue/card'
import Button from 'primevue/button'

import WelcomeIcon from '@/components/icons/WelcomeIcon.vue'
import WalletIcon from '@/components/icons/WalletIcon.vue'
import TransactionIcon from '@/components/icons/TransactionIcon.vue'
import CategoryIcon from '@/components/icons/CategoryIcon.vue'
import CurrencyIcon from '@/components/icons/CurrencyIcon.vue'

const cards = ref([
  {
    title: 'Create a new wallet',
    content: 'Create a new wallet to start tracking your expenses.',
    icon: shallowRef(WalletIcon),
    action: 'Create a new wallet',
    route: '/wallets'
  },
  {
    title: 'View transaction history',
    content: 'View your transaction history to see where your money is going.',
    icon: shallowRef(TransactionIcon),
    action: 'View transaction history',
    route: '/transactions'
  },
  {
    title: 'Create a category',
    content: 'Create a category to organize your expenses.',
    icon: shallowRef(CategoryIcon),
    action: 'Create a category',
    route: '/categories'
  },
  {
    title: 'Create a currency',
    content: 'Create a currency to start tracking your expenses.',
    icon: shallowRef(CurrencyIcon),
    action: 'Create a currency',
    route: '/currencies'
  }
])
</script>

<template>
  <section class="welcome flex flex-col items-center">
    <h1 class="text-2xl text-center font-bold flex flex-col items-center tracking-wider">
      <WelcomeIcon class="w-32 h-32" />
      Welcome to Penny Wise
    </h1>
    <p class="text-center text-surface-600 flex flex-col py-2">
      <span class="max-w-lg line-clamp-2"
        >Penny Wise is a simple budgeting app that helps you track your expenses.</span
      >
      <span class="max-w-lg truncate">What would you like to do?</span>
    </p>
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card v-for="card in cards" :key="card.route" style="overflow: hidden">
        <template #header>
          <div>
            <div class="w-full h-36 relative">
              <component :is="card.icon" class="absolute w-full h-full py-4" />
            </div>
          </div>
        </template>
        <template #title>
          <span class="text-center" v-text="card.title" />
        </template>
        <template #content>
          <p class="m-0" v-text="card.content" />
        </template>
        <template #footer>
          <RouterLink :to="card.route">
            <Button :label="card.action" class="w-full" />
          </RouterLink>
        </template>
      </Card>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
