<script setup lang="ts">
import TheLogo from '@/components/TheLogo.vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
</script>

<template>
  <section class="register-form">
    <div class="register-form__inner">
      <TheLogo class="mt-4 px-6" />
      <div class="form">
        <h2 class="form__header">
          Register a new account
        </h2>
        <div class="form__body">
          <div class="form__group">
            <label for="username" class="form__label">Username</label>
            <InputText class="form__input" id="username" type="text" placeholder="Enter your username" />
            <small class="form__validation-error" id="username-help" />
          </div>
          <div class="form__group">
            <label for="email" class="form__label">Email</label>
            <InputText class="form__input" id="email" type="email" placeholder="Enter your email address"  />
            <small class="form__validation-error" id="email-help" />
          </div>
          <div class="flex flex-row space-x-4">
            <div class="form__group w-full">
              <label for="password" class="form__label">Password</label>
              <Password id="password" :feedback="false" toggle-mask placeholder="Enter your password"
                        class="form__input" />
              <small class="form__validation-error" id="password-help"></small>
            </div>
            <div class="form__group w-full">
              <label for="password-confirmation" class="form__label">Confirm password</label>
              <Password id="password-confirmation" :feedback="false" toggle-mask placeholder="Re-Enter your password"
                        class="form__input" />
              <small class="form__validation-error" id="password-confirmation-help"></small>
            </div>
          </div>
          <Button label="Create a new account" class="mt-[1.2rem!important]" />
          <div class="text-gray-600">
            Already have an account?
            <RouterLink to="/login" class="text-primary-500 hover:underline">Login</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.register-form {
  @apply container mx-auto px-6;

  &__inner {
    @apply md:max-w-[30rem] mt-10 flex flex-col mx-auto bg-white drop-shadow-md rounded;
  }
}
</style>