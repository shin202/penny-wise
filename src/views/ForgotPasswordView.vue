<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ForgotPasswordIcon from '@/components/icons/ForgotPasswordIcon.vue'
import { usePassword } from '@/stores/password.store'
import { storeToRefs } from 'pinia'
import EmailSentIcon from '@/components/icons/EmailSentIcon.vue'
import { useForgotPasswordHelper } from '@/helpers'

const { isEmailSent } = storeToRefs(usePassword())
const { formValues, errors, onSubmitHandler, isSubmitting } = useForgotPasswordHelper()
</script>

<template>
  <section class="forgot-password">
    <div class="forgot-password__inner">
      <EmailSentIcon v-if="isEmailSent" class="mt-4 w-24 h-24 self-center" />
      <ForgotPasswordIcon v-else class="mt-4 w-24 h-24 self-center" />
      <div v-if="isEmailSent" class="flex flex-col px-6 py-4">
        <h2 class="text-center text-lg font-semibold">Email Sent</h2>
        <p class="text-center text-gray-500 line-clamp-3 py-1">
          We've sent you an email with a link to reset your password. If you don't receive the email
          within a few minutes, please check your spam folder.
        </p>
      </div>
      <div v-else class="form">
        <h2 class="form__header self-center flex flex-col">
          <span>Forgot Password</span>
          <span class="text-sm font-normal text-gray-500 line-clamp-2 py-1"
            >Enter your email and we'll send you a link to reset your password.</span
          >
        </h2>
        <div class="form__body">
          <div class="form__group">
            <label for="email" class="form__label">Email</label>
            <InputText
              v-model="formValues.email"
              v-bind="formValues.emailAttrs"
              class="form__input"
              id="email"
              type="email"
              placeholder="Enter your email address"
              :disabled="isSubmitting"
            />
            <Transition name="fade">
              <small
                v-if="errors.email"
                v-text="errors.email"
                class="form__validation-error"
                id="email-help"
              />
            </Transition>
          </div>
          <Button
            label="Reset password"
            class="mt-[1.2rem!important]"
            :disabled="isSubmitting"
            :loading="isSubmitting"
            @click="onSubmitHandler"
          />
          <div class="text-gray-600 self-center">
            <RouterLink
              to="/login"
              class="flex justify-center items-center text-sm mt-4 hover:text-primary-500"
            >
              <i class="pi pi-arrow-left" style="font-size: 0.8rem"></i>
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
