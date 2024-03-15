<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormError, FormSubmitEvent } from '#ui/types'
import { Separator } from '~/components/ui/separator'

definePageMeta({
  layout: 'empty'
})

const schema = object({
  username: string().required('Required'),
  password: string()
      .min(8, 'Must be at least 8 characters')
      .required('Required')
});


type Schema = InferType<typeof schema>

const state = reactive({
  username: undefined,
  password: undefined
})

const form = ref();
async function onSubmit (event: FormSubmitEvent<Schema>) {
  try {
    const allUsers = (await $fetch('/api/users')).users;
    const entered = event.data
    if (allUsers?.filter(x => x.userName == entered.username && x.userPassword == entered.password).length > 0)
    {
      navigateTo('/dashboard')
    }
  }
  catch (err: any) {
    
  }
}

</script>

<template>
  <div class="w-full h-dvh flex flex-row items-center justify-center gap-4">
    <div class="relative flex flex-col justify-center h-screen overflow-hidden">
      <div class="flex flex-col w-full p-6 m-auto bg-slate-800 rounded-lg shadow-md ring-2 ring-gray-800/50 lg:max-w-lg items-center justify-center align-middle">
        <h1 class="text-2xl font-semibold text-center text-white mb-1.5 rounded-lg p-2">Sign In</h1>
        <img src="~/assets/img/logo.png" class="mb-2.5">
        <UForm class="space-y-4 w-full" :schema="schema" :state="state" @submit="onSubmit">
          <div class="w-full">
              <UFormGroup label="Username" name="username">
                <UInput v-model="state.username" type="text" placeholder="..." />
              </UFormGroup>
          </div>
          <div>
            <UFormGroup label="Password" name="password">
              <UInput v-model="state.password" type="password" placeholder="..." class="w-full" />
            </UFormGroup>
          </div>
          <a href="#" class="text-xs text-base hover:underline hover:text-blue-600">Forget Password?</a>
          <div>
            <UButton type="submit" class="btn btn-block" color="blue">
              Login
              <template #leading>
                <UIcon name="i-heroicons-arrow-right-20-solid" />
              </template>
            </UButton>
          </div>
        </UForm>
        <Separator class="my-2" />
        <UButton color="black" label="Login with Okta" block>
          <template #leading>
            <UAvatar src="https://i.ibb.co/bN0cXRj/okta-icon-logo-BA04542-B4-E-seeklogo-com.png" size="2xs"/>
          </template>
        </UButton>
        <div class="w-full h-full flex flex-col flex-start">
          <label class="label">
            <span class="text-base label-text text-xs">No account? Register here.</span>
          </label>
          <NuxtLink to="register">
            <UButton class="btn" color="blue">Register</UButton>
          </NuxtLink>
        </div>
       
      </div>
    </div>
  </div>
</template>
