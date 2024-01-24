<script setup lang="ts">
import TheLogo from '@/components/TheLogo.vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
</script>

<template>
  <section class="login-form">
    <div class="login-form__inner">
      <TheLogo class="mt-4 px-6" />
      <div class="form">
        <h2 class="form__header">
          Login to your account
        </h2>
        <div class="form__body">
          <div class="form__group">
            <label for="username-or-email" class="login-form__label">Username or email</label>
            <InputText id="username-or-email" type="text" placeholder="Enter your username or email"
                       class="login-form__input" />
            <small class="form__validation-error" id="username-or-email-help">Error</small>
          </div>
          <div class="form__group">
            <label for="password" class="form__label">Password</label>
            <Password id="password" :feedback="false" toggle-mask placeholder="Enter your password"
                      class="form__input" />
            <small class="form__validation-error" id="username-or-email-help">Error</small>
          </div>
          <div class="text-gray-600 self-end">
            <RouterLink to="/forgot-password" class="text-blue-500 hover:underline">Forgot your password?</RouterLink>
          </div>
          <Button label="Login" severity="info" class="mt-[1.2rem!important]" />
          <div class="text-gray-600">
            Don't have an account?
            <RouterLink to="/register" class="text-blue-500 hover:underline">Register</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.login-form {
  @apply container mx-auto px-6;

  &__inner {
    @apply md:max-w-[30rem] mt-10 flex flex-col mx-auto bg-white drop-shadow-md rounded;
  }
}

.form {
  @apply flex flex-col px-6 py-4;

  &__header {
    @apply font-bold text-base md:text-lg text-center truncate self-start;
  }

  &__body {
    @apply mt-6 flex flex-col space-y-1.5;
  }

  &__group {
    @apply flex flex-col space-y-1;
  }

  &__label {
    @apply text-sm font-semibold text-gray-700;
  }

  &__input {
    @apply w-full;
  }

  &__validation-error {
    @apply text-xs text-red-500;
  }
}
</style>