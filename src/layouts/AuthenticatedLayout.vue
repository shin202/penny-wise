<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useResizeObserver } from '@vueuse/core'

import Menu from 'primevue/menu'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import Avatar from 'primevue/avatar'
import Breadcrumb from 'primevue/breadcrumb'
import ScrollPanel from 'primevue/scrollpanel'
import type { MenuItem } from 'primevue/menuitem'

import TheLogo from '@/components/TheLogo.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useAuth } from '@/stores/auth.store'

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()

const isSidebarOpen = ref<boolean>(false)
const menuItems = computed(() => {
  return [
    {
      separator: true
    },
    {
      label: 'Overview',
      items: [
        {
          label: 'Stats',
          icon: 'pi pi-chart-bar',
          route: '/stats',
          active: route.path === '/stats'
        }
      ]
    },
    {
      label: 'Profile',
      items: [
        {
          label: 'My Wallets',
          icon: 'pi pi-wallet',
          route: '/wallets',
          active: route.path === '/wallets'
        },
        {
          label: 'Transaction History',
          icon: 'pi pi-bookmark',
          route: '/transactions',
          active: route.path === '/transactions'
        }
      ]
    },
    {
      separator: true
    },
    {
      label: 'Settings',
      items: [
        {
          label: 'Manage Categories',
          icon: 'pi pi-list',
          route: '/categories',
          active: route.path === '/categories'
        },
        {
          label: 'Manage Currency',
          icon: 'pi pi-money-bill',
          route: '/currencies',
          active: route.path === '/currencies'
        },
        {
          label: 'Manage Icons',
          icon: 'pi pi-image',
          route: '/images',
          active: route.path === '/images'
        },
        {
          label: 'Others Settings',
          icon: 'pi pi-cog'
        }
      ]
    },
    {
      separator: true
    }
  ]
})
const navbarItems = computed(() => {
  return [
    {
      label: 'Home',
      icon: 'pi pi-home',
      route: '/',
      active: route.path === '/'
    },
    {
      label: 'About',
      icon: 'pi pi-info-circle',
      route: '/about',
      active: route.path === '/about'
    }
  ]
})
const breadcrumbHome = computed(
  (): MenuItem => ({
    label: 'Home',
    icon: 'pi pi-home',
    route: '/',
    active: route.path === '/'
  })
)
const breadcrumbItems = computed(() => {
  return route.matched
    .map((match) => {
      const breadcrumb = match.meta?.breadcrumb
      if (!breadcrumb) return null

      return {
        label: breadcrumb,
        route: match.path,
        active: route.path === match.path,
        items: match.children.map((child) => ({
          label: child.meta?.breadcrumb,
          route: child.path,
          active: route.path === child.path
        }))
      }
    })
    .filter(Boolean)
})
const toggleSidebarBtnIcon = computed(() => {
  return isSidebarOpen.value ? 'pi pi-times' : 'pi pi-bars'
})

const onOpenSidebar = () => (isSidebarOpen.value = true)

const onCloseSidebar = () => (isSidebarOpen.value = false)

const onLogout = async () => {
  await logout()
  await router.push({ path: '/login' })
}

useResizeObserver(window.document.documentElement, ([entry]) => {
  const { width } = entry.contentRect

  if (width <= 768 && isSidebarOpen.value) isSidebarOpen.value = false
})
</script>

<template>
  <section class="authenticated-layout">
    <div class="menu-bar" :class="{ 'menu-bar--open': isSidebarOpen }">
      <Menu :model="menuItems" style="height: 100%">
        <template #start>
          <div class="flex justify-between md:justify-center items-center mb-4">
            <TheLogo />
            <Button class="md:hidden" text icon="pi pi-times" rounded @click="onCloseSidebar" />
          </div>
        </template>
        <template #submenuheader="{ item }">
          <span class="text-primary-500 dark:text-primary-400 font-bold leading-none">{{
            item.label
          }}</span>
        </template>
        <template #item="{ item, props }">
          <RouterLink
            v-if="item.route"
            :to="item.route"
            class="flex items-center rounded-md"
            :class="{
              'text-primary-600 bg-surface-100 dark:text-primary-400 dark:bg-surface-400/10':
                item.active
            }"
            v-bind="props.action"
            @click="onCloseSidebar"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
            <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          </RouterLink>
          <a
            v-else
            v-ripple
            class="flex items-center"
            v-bind="props.action"
            @click="onCloseSidebar"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
            <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          </a>
        </template>
        <template #end>
          <Button label="Logout" icon="pi pi-sign-out" class="w-full mt-2" @click="onLogout" />
        </template>
      </Menu>
    </div>
    <main class="w-full h-screen relative md:pl-64 flex flex-col">
      <Menubar>
        <template #start>
          <div class="hidden md:flex md:items-center">
            <RouterLink
              v-for="item in navbarItems"
              :key="item.label"
              :to="item.route"
              class="text-surface-500 font-semibold mx-1.5"
            >
              <span :class="item.icon" class="mr-2" />
              <span v-text="item.label" :class="{ 'text-primary-500': item.active }" />
            </RouterLink>
          </div>
          <Button
            class="md:hidden"
            type="button"
            :icon="toggleSidebarBtnIcon"
            severity="secondary"
            outlined
            @click="onOpenSidebar"
          />
        </template>
        <template #end>
          <div class="flex align-items-center gap-2">
            <Avatar
              icon="pi pi-user"
              shape="circle"
              style="background-color: #c1fcdf; color: #1a945f"
            />
          </div>
        </template>
      </Menubar>
      <ScrollPanel class="w-full h-[calc(100%-8rem)]">
        <div class="px-4 md:px-6">
          <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mt-4">
            <template #item="{ item, props }">
              <RouterLink v-if="item.route" :to="item.route" v-slot="{ href, navigate }" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                  <span :class="[item.icon]" />
                  <span class="font-semibold" :class="{ 'text-primary-500': item.active }">{{
                    item.label
                  }}</span>
                </a>
              </RouterLink>
              <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span>{{ item.label }}</span>
              </a>
            </template>
          </Breadcrumb>
          <slot />
        </div>
      </ScrollPanel>
      <TheFooter class="left-0 md:left-64" />
    </main>
  </section>
</template>

<style scoped lang="scss">
.authenticated-layout {
  @apply flex min-h-screen;
}

.menu-bar {
  @apply w-full md:w-64 fixed top-0 left-0 h-full z-[999] -translate-x-full md:translate-x-0 transition-transform duration-200;

  &--open {
    @apply translate-x-0;
  }
}
</style>
