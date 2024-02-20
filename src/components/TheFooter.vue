<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__text">
        <span>Made with ♥ by <a href="#" target="_blank" rel="noopener noreferrer">Shin</a></span>
        <span>&copy; {{ currentYear }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  @apply flex items-center bg-surface-0 dark:bg-surface-900 rounded-md shadow-md px-6 min-h-[4rem];

  &__inner {
    @apply w-full;
  }

  &__text {
    @apply flex justify-between;
  }
}
</style>
