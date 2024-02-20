<script setup lang="ts">
import { ref } from 'vue'

import CustomFileUpload from '@/components/CustomFileUpload.vue'

const maxFileSize = ref<number>(5000000)
</script>

<template>
  <CustomFileUpload
    name="images"
    :multiple="true"
    :url="`/api/images`"
    :maxFileSize="maxFileSize"
  />
</template>
