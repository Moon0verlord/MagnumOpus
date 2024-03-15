<script setup lang="ts">
import type { FormError } from '#ui/types'

definePageMeta({
  layout: 'empty'
})

const fields = [{
  name: 'username',
  type: 'text',
  label: 'Username',
  placeholder: 'Enter your username'
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password'
}]

const validate = async (state: any) => {
  const errors: FormError[] = []
  if (!state.username) errors.push({ path: 'username', message: 'Username is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  if (errors.length >= 1) return errors; // speed up errors if any one of these errors has already been found, else search for user in DB which takes longer.
  const response = await $fetch('/api/users');
  const allUsers = response.users;
  if (allUsers?.filter(x => x.name == state.username && x.password == state.password).length <= 0) {
    errors.push({path: 'password', message: 'Username or password not found.'})
  }
  return errors
}

const providers = [{
  label: 'Continue with Okta',
  icon: 'i-logos-okta-icon',
  color: 'blue' as const,
  click: () => {
    console.log('Redirect to Okta')
  }
}]

function onSubmit (data: any) {
  navigateTo("/dashboard")
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div class="w-screen h-screen flex align-middle justify-center">
    <div class="p-20">
      <UCard class="max-w-sm w-full">
        <UAuthForm
            :fields="fields"
            :validate="validate"
            :providers="providers"
            title="Welcome back!"
            align="top"
            icon="i-heroicons-lock-closed"
            :ui="{ base: 'text-center', footer: 'text-center' }"
            @submit="onSubmit"
        >
          <template #description>
            Don't have an account? <NuxtLink to="/register" class="text-primary font-medium">Sign up</NuxtLink>.
          </template>

          <template #password-hint>
            <NuxtLink to="/" class="text-primary font-medium">Forgot password?</NuxtLink>
          </template>

          <template #footer>
            By signing in, you agree to our <NuxtLink to="/" class="text-primary font-medium">Terms of Service</NuxtLink>.
          </template>
        </UAuthForm>
      </UCard>
    </div>
    
  </div>
</template>