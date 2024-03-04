<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import * as yup from 'yup';
import type { FormError, FormSubmitEvent } from '#ui/types'

const toast = useToast();


const schema = object({
  username: string().required('Required').min(3, 'Must at least be 2 characters'),
  password: string()
      .min(8, 'Must be at least 8 characters')
      .required('Required'),
  passwordConfirm: string().min(8, 'Must at least be 8 characters').required().oneOf([yup.ref('password')], "Passwords do not match"),
});


type Schema = InferType<typeof schema>

const state = reactive({
  username: undefined,
  password: undefined,
  passwordConfirm: undefined
})

const form = ref();
async function onSubmit (event: FormSubmitEvent<Schema>) {
  try {
    const result = await $fetch('api/users', {
      method: "POST",
      body: {
        userName: event.data.username,
        userPassword: event.data.password
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

<template>
  <div class="w-full h-dvh flex flex-row items-center justify-center gap-4">
    <div class="relative flex flex-col justify-center h-screen overflow-hidden">
      <div class="flex flex-col w-full p-6 m-auto bg-slate-800 rounded-lg shadow-md ring-2 ring-gray-800/50 lg:max-w-lg items-center justify-center align-middle">
        <h1 class="text-2xl font-semibold text-center text-white mb-1.5 rounded-lg p-2">Register</h1>
        <img src="~/assets/img/logo.png" class="mb-2.5">
        <UForm class="space-y-4 w-full" :schema="schema" :state="state" @submit="onSubmit">
          <div class="w-full">
            <UFormGroup label="Username" name="username" required>
              <UInput v-model="state.username" type="text" placeholder="..." />
            </UFormGroup>
          </div>
          <div>
            <UFormGroup label="Password" name="password" required>
              <UInput v-model="state.password" type="password" placeholder="..." class="w-full" />
            </UFormGroup>
          </div>
          <div>
            <UFormGroup label="Confirm Password" name="passwordConfirm" required>
              <UInput v-model="state.passwordConfirm" type="password" placeholder="..." class="w-full" />
              <FormError name="passwordConfirm" />
            </UFormGroup>
          </div>
          <div>
            <UButton type="submit" class="btn btn-block" color="blue">Register</UButton>
            <NuxtLink to="/">
              <button class="text-xs text-base hover:underline hover:text-blue-600">Already have an account? Log in here.</button>
            </NuxtLink>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>