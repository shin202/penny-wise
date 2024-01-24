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
                       class="form__input" color="blue" />
            <small class="form__validation-error" id="username-or-email-help" />
          </div>
          <div class="form__group">
            <label for="password" class="form__label">Password</label>
            <Password id="password" :feedback="false" toggle-mask placeholder="Enter your password"
                      class="form__input" />
            <small class="form__validation-error" id="password-help" />
          </div>
          <div class="text-gray-600 self-end">
            <RouterLink to="/forgot-password" class="text-primary-500 hover:underline">Forgot your password?</RouterLink>
          </div>
          <Button label="Login" class="mt-[1.2rem!important]" />
          <div class="text-gray-600">
            Don't have an account?
            <RouterLink to="/register" class="text-primary-500 hover:underline">Register</RouterLink>
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
</style>