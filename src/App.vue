<script setup lang="ts">
import { RouterView } from 'vue-router'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmPopup from 'primevue/confirmpopup'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
</script>

<template>
  <Toast position="bottom-right" />
  <ConfirmDialog group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-5 bg-surface-0 dark:bg-surface-700 rounded-md">
        <div
          class="rounded-full bg-red-500 dark:bg-red-400 text-surface-0 dark:text-surface-900 inline-flex justify-center items-center h-[6rem] w-[6rem] -mt-[3rem]"
        >
          <i :class="[message.icon, 'text-5xl']" />
        </div>
        <span class="font-bold text-2xl block mb-2 mt-4">{{ message?.header }}</span>
        <p class="mb-0 text-center">{{ message?.message }}</p>
        <div class="flex items-center gap-2 mt-4">
          <Button
            :label="message.rejectLabel"
            outlined
            severity="secondary"
            @click="rejectCallback"
            class="w-[8rem]"
            text
          />
          <Button
            :label="message.acceptLabel"
            severity="danger"
            @click="acceptCallback"
            class="w-[8rem]"
            text
          />
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <ConfirmDialog group="logout">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-5 bg-surface-0 dark:bg-surface-700 rounded-md">
        <div
          class="rounded-full bg-red-500 dark:bg-red-400 text-surface-0 dark:text-surface-900 inline-flex justify-center items-center h-[6rem] w-[6rem] -mt-[3rem]"
        >
          <i class="pi pi-question text-5xl" />
        </div>
        <span class="font-bold text-2xl block mb-2 mt-4">{{ message?.header }}</span>
        <p class="mb-0 text-center">{{ message?.message }}</p>
        <div class="flex items-center gap-2 mt-4">
          <Button
            :label="message.rejectLabel"
            outlined
            severity="secondary"
            @click="rejectCallback"
            class="w-[8rem]"
            text
          />
          <Button
            :label="message.acceptLabel"
            severity="success"
            @click="acceptCallback"
            class="w-[8rem]"
            text
          />
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <ConfirmPopup />
  <RouterView />
</template>
