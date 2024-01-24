<script setup lang="ts">
import TheLogo from '@/components/TheLogo.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ForgotPasswordIcon from '@/components/icons/ForgotPasswordIcon.vue'
</script>

<template>
  <section class="forgot-password">
    <div class="forgot-password__inner">
      <ForgotPasswordIcon class="mt-4 w-24 h-24 self-center"/>
      <div class="form">
        <h2 class="form__header self-center flex flex-col">
          <span>Forgot Password</span>
          <span class="text-sm font-normal text-gray-500 line-clamp-2 py-1">Enter your email and we'll send you a link to reset your password.</span>
        </h2>
        <div class="form__body">
          <div class="form__group">
            <label for="email" class="form__label">Email</label>
            <InputText class="form__input" id="email" type="email" placeholder="Enter your email address"  />
            <small class="form__validation-error" id="email-help" />
          </div>
          <Button label="Reset password" class="mt-[1.2rem!important]" />
          <div class="text-gray-600 self-center">
            <RouterLink to="/login" class="flex justify-center items-center text-sm mt-4 hover:text-primary-500">
              <i class="pi pi-arrow-left" style="font-size: 0.8rem;"></i>
              <span class="ml-2">Back to Login</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.forgot-password {
  @apply container mx-auto px-6;

  &__inner {
    @apply md:max-w-[30rem] mt-10 flex flex-col mx-auto bg-white drop-shadow-md rounded;
  }
}
</style>