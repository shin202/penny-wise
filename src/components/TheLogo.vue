<script setup lang="ts">

</script>

<template>
  <div class="logo">
    <div class="logo__inner">
      <h1 class="logo__text">Penny Wise</h1>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  @apply flex items-center;

  &__text {
    @apply uppercase text-center text-lg md:text-xl font-bold tracking-widest px-4 py-2 bg-primary-500 text-white rounded;
  }
}
</style>