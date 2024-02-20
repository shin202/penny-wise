<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import TheLogo from '@/components/TheLogo.vue'
import { useAuth } from '@/stores/auth.store'
import { CreateUserSchema } from '@/common/schemas'
import { useGlobal } from '@/stores/global.store'

const router = useRouter()
const { showToastSuccess } = useGlobal()
const auth = useAuth()

const errorMessages = ref()
const isSubmitting = ref(false)

const validationSchema = toTypedSchema(CreateUserSchema)
const { handleSubmit, errors, defineField } = useForm({
  validationSchema
})
const [username, usernameAttrs] = defineField('username')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('passwordConfirmation')

const validationErrors = computed(() => {
  return {
    username: errors.value.username || errorMessages.value.username,
    email: errors.value.email || errorMessages.value.email,
    password: errors.value.password || errorMessages.value.password,
    passwordConfirmation:
      errors.value.passwordConfirmation || errorMessages.value.passwordConfirmation
  }
})

const initErrorMessages = () => {
  errorMessages.value = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  }
}

initErrorMessages()

const setErrorMessage = (field: string, message: string) => {
  errorMessages.value = { ...errorMessages.value, [field]: message }
}

const validatePasswordConfirmation = (value: string) => {
  if (!value) {
    setErrorMessage('passwordConfirmation', 'Password confirmation is required')
    return false
  }

  if (value !== password.value) {
    setErrorMessage('passwordConfirmation', 'Passwords do not match')
    return false
  }

  setErrorMessage('passwordConfirmation', '')
  return true
}

const onPasswordConfirmationInput = (event: any) => {
  const value = event.target.value
  validatePasswordConfirmation(value)
}

const setSubmitting = (value: boolean) => (isSubmitting.value = value)

const registerHandler = async (values: any) => {
  setSubmitting(true)

  const isValidPasswordConfirmation = validatePasswordConfirmation(values.passwordConfirmation)

  if (!isValidPasswordConfirmation) {
    setSubmitting(false)
    return
  }

  const { isSuccess, message, errors } = await auth.register(values)
  setSubmitting(false)

  if (isSuccess) {
    showToastSuccess(message)
    await router.push({ path: '/login' })
  } else {
    if (errors) {
      errors.forEach((error) => {
        setErrorMessage(error.property, error.message)
      })
    }
  }
}

const onSubmitHandler = handleSubmit(registerHandler)
</script>

<template>
  <section class="register-form">
    <div class="register-form__inner">
      <TheLogo class="mt-4 px-6" />
      <div class="form">
        <h2 class="form__header">Register a new account</h2>
        <div class="form__body">
          <div class="form__group">
            <label for="username" class="form__label form__label--required">Username</label>
            <InputText
              class="form__input"
              id="username"
              type="text"
              placeholder="Enter your username"
              v-model="username"
              v-bind="usernameAttrs"
              :disabled="isSubmitting"
              :minlength="4"
              :maxlength="20"
              autofocus
              required
              tabindex="1"
            />
            <Transition name="fade">
              <small
                v-if="validationErrors.username"
                class="form__validation-error"
                id="username-help"
                :title="validationErrors.username"
                v-text="validationErrors.username"
              />
            </Transition>
          </div>
          <div class="form__group">
            <label for="email" class="form__label form__label--required">Email</label>
            <InputText
              class="form__input"
              id="email"
              type="email"
              placeholder="Enter your email address"
              v-model="email"
              v-bind="emailAttrs"
              :disabled="isSubmitting"
              required
              tabindex="2"
            />
            <Transition name="fade">
              <small
                v-if="validationErrors.email"
                class="form__validation-error"
                id="email-help"
                :title="validationErrors.email"
                v-text="validationErrors.email"
              />
            </Transition>
          </div>
          <div class="flex flex-row space-x-4">
            <div class="form__group w-full">
              <label for="password" class="form__label form__label--required">Password</label>
              <Password
                id="password"
                :feedback="false"
                toggle-mask
                placeholder="Enter your password"
                class="form__input"
                v-model="password"
                v-bind="passwordAttrs"
                :disabled="isSubmitting"
                :minlength="8"
                :maxlength="12"
                required
                tabindex="3"
              />
              <Transition name="fade">
                <small
                  v-if="validationErrors.password"
                  class="form__validation-error"
                  id="password-help"
                  :title="validationErrors.password"
                  v-text="validationErrors.password"
                />
              </Transition>
            </div>
            <div class="form__group w-full">
              <label for="password-confirmation" class="form__label form__label--required"
                >Confirm password</label
              >
              <Password
                id="password-confirmation"
                :feedback="false"
                toggle-mask
                placeholder="Re-enter password"
                class="form__input"
                v-model="passwordConfirmation"
                v-bind="passwordConfirmationAttrs"
                :disabled="isSubmitting"
                :minlength="8"
                :maxlength="12"
                required
                @input="onPasswordConfirmationInput"
                tabindex="4"
              />
              <Transition name="fade">
                <small
                  v-if="validationErrors.passwordConfirmation"
                  class="form__validation-error"
                  id="password-confirmation-help"
                  :title="validationErrors.passwordConfirmation"
                  v-text="validationErrors.passwordConfirmation"
                />
              </Transition>
            </div>
          </div>
          <Button
            label="Create a new account"
            class="mt-[1.2rem!important]"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            @click.prevent="onSubmitHandler"
            tabindex="5"
          />
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
