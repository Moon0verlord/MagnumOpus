<script setup lang="ts">
import type { FormError } from '#ui/types'
import { v4 as uuidv4 } from 'uuid';

definePageMeta({
  layout: 'empty'
})

const fields_register = [
  {
  name: 'username',
  type: 'text',
  label: 'Username',
  placeholder: 'Enter your username'
}, 
  {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password'
}, 
  {
  name: 'passwordConfirm',
  label: 'Password Confirmation',
  type: 'password',
  placeholder: 'Enter your password again'
}]

const validate = async (state: any) => {
  const errors: FormError[] = []
  if (!state.username) errors.push({ path: 'username', message: 'Username is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  if (state.password != state.passwordConfirm) errors.push({ path: 'passwordConfirm', message: 'Passwords are not the same.' })
  return errors
}

const toast = useToast();
function onSubmit (data: any) {
  try {
    const result = $fetch('api/users', {
      method: "POST",
      body: {
        userId: uuidv4(),
        name: data.username,
        email: 'example@test.com', 
        password: data.password,
        oktaId: null,
        isAdmin: 0
      }
    });
    // check for response code here
    toast.add({
      id: "1",
      title: "Succesful registration",
      description: "You registered an account!",
      icon: "i-heroicons-check-circle",
    });
  }
  catch (err: any) {

  }
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div class="w-screen h-screen flex align-middle justify-center">
    <div class="p-20">
      <UCard class="max-w-sm w-full">
        <UAuthForm
            :fields="fields_register"
            :validate="validate"
            title="Register an Account"
            align="top"
            icon="i-heroicons-user-circle"
            :ui="{ base: 'text-center', footer: 'text-center' }"
            @submit="onSubmit"
        >
          <template #description>
            Already have an account? <NuxtLink to="/" class="text-primary font-medium">Sign in</NuxtLink>.
          </template>
        </UAuthForm>
      </UCard>
    </div>
  </div>
</template>