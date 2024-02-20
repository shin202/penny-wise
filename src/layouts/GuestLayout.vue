<script setup lang="ts">
import { ref } from 'vue'

import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import type { MenuItem } from 'primevue/menuitem'

import TheLogo from '@/components/TheLogo.vue'

const navbarItems = ref<MenuItem[]>([
  {
    label: 'Login',
    icon: 'pi pi-sign-in',
    route: '/login'
  },
  {
    label: 'Register',
    icon: 'pi pi-user-plus',
    route: '/register'
  }
])
</script>

<template>
  <section class="guest-layout">
    <Menubar>
      <template #start>
        <div>
          <TheLogo />
        </div>
      </template>
      <template #end>
        <div class="flex items-center space-x-4">
          <RouterLink v-for="item in navbarItems" :to="item.route" :key="item.label">
            <Button :label="item.label" :icon="item.icon" :outlined="item.route === '/login'" />
          </RouterLink>
        </div>
      </template>
    </Menubar>
  </section>
</template>

<style scoped lang="scss"></style>
