<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

import TheLogo from '@/components/TheLogo.vue'
import { LoginCredentialsSchema } from '@/common/schemas'
import { useAuth } from '@/stores/auth.store'
import { useGlobal } from '@/stores/global.store'

const router = useRouter()
const { showToastSuccess } = useGlobal()
const auth = useAuth()

const isSubmitting = ref(false)
const loginErrorMessage = ref('')

const validationSchema = toTypedSchema(LoginCredentialsSchema)
const { handleSubmit, errors, defineField } = useForm({
  validationSchema
})
const [usernameOrEmail, usernameOrEmailAttrs] = defineField('usernameOrEmail')
const [password, passwordAttrs] = defineField('password')

const setSubmitting = (value: boolean) => (isSubmitting.value = value)

const setLoginErrorMessage = (message: string = '') => (loginErrorMessage.value = message)

const loginHandler = async (values: any) => {
  setSubmitting(true)
  const { isSuccess, message } = await auth.login(values)
  setSubmitting(false)

  if (!isSuccess) {
    setLoginErrorMessage(message)
    return
  }

  showToastSuccess(message)
  setLoginErrorMessage()
  await router.push({ path: '/' })
}

const onSubmitHandler = handleSubmit(loginHandler)
</script>
<template>
  <section class="login-form">
    <div class="login-form__inner">
      <TheLogo class="mt-4 px-6" />
      <div class="form">
        <h2 class="form__header">Login to your account</h2>
        <div class="form__body">
          <Message v-if="loginErrorMessage" severity="error" :closable="false"
            >{{ loginErrorMessage }}
          </Message>
          <div class="form__group">
            <label for="username-or-email" class="login-form__label">Username or email</label>
            <InputText
              id="username-or-email"
              type="text"
              placeholder="Enter your username or email"
              class="form__input"
              v-model="usernameOrEmail"
              v-bind="usernameOrEmailAttrs"
              :disabled="isSubmitting"
              required
              autofocus
              tabindex="1"
            />
            <Transition name="fade">
              <small
                v-if="errors.usernameOrEmail"
                class="form__validation-error"
                id="username-or-email-help"
                v-text="errors.usernameOrEmail"
              />
            </Transition>
          </div>
          <div class="form__group">
            <label for="password" class="form__label">Password</label>
            <Password
              id="password"
              :feedback="false"
              toggle-mask
              placeholder="Enter your password"
              class="form__input"
              v-model="password"
              v-bind="passwordAttrs"
              :disabled="isSubmitting"
              required
              tabindex="2"
            />
            <Transition name="fade">
              <small
                v-if="errors.password"
                class="form__validation-error"
                id="password-help"
                v-text="errors.password"
              />
            </Transition>
          </div>
          <div class="text-gray-600 self-end">
            <RouterLink to="/forgot-password" class="text-primary-500 hover:underline"
              >Forgot your password?
            </RouterLink>
          </div>
          <Button
            label="Login"
            class="mt-[1.2rem!important]"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            @click.prevent="onSubmitHandler"
            tabindex="3"
          />
          <div class="text-gray-600">
            Don't have an account?
            <RouterLink to="/register" class="text-primary-500 hover:underline"
              >Register
            </RouterLink>
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
