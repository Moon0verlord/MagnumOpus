<script setup lang="ts">
  import { Input } from '@/components/ui/input'
  import { useRouter } from 'vue-router';
  import { toTypedSchema } from '@vee-validate/zod'
  import * as z from 'zod'
  import { useForm } from 'vee-validate';

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirm_password: z.string().min(8),
  })

  const typedFormSchema = toTypedSchema(formSchema)

  const { handleSubmit } = useForm({
    validationSchema: typedFormSchema,
  })

  const onSubmit = handleSubmit((values) => {
    console.log('Form submitted!', values)
  })

  const router = useRouter();

  const goToLogin = () => {
    router.push('/');
  };
</script>

<template>
  <div class="md:hidden">
    <VPImage
      alt="Authentication"
      width="1280"
      height="1214"
      class="block"
      :image="{
        dark: '/examples/authentication-dark.png',
        light: '/examples/authentication-light.png',
      }"
    />
  </div>


      <!-- Login Button at the top right of the page -->
    <div class="absolute top-0 right-0 pt-4 pr-4">
      <Button @click="goToLogin" variant="ghost">
        Login
      </Button>
    </div>

  <div class="flex h-screen overflow-hidden lg:grid lg:grid-cols-2">
    <!-- Dark section -->
    <div class="flex flex-col justify-center bg-zinc-900 text-white lg:min-h-screen">
      <div class="px-10 py-20">
        <div class="flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3z" />
          </svg>
          Schuberg Philis
        </div>
        <blockquote class="mt-8 space-y-4">
          <p class="text-lg leading-relaxed">
            &ldquo;Pee is stored in the balls.&rdquo;
          </p>
          <footer class="text-sm font-medium">
            — Gingus Khan
          </footer>
        </blockquote>
      </div>
    </div>
    
    <!-- Form section with login button on top right -->
      <div class="flex flex-col justify-center lg:min-h-screen">
      <div class="p-8 mx-auto w-full max-w-md">
        <h1 class="text-2xl font-semibold text-center">Create an account</h1>
        <form class="mt-8 space-y-6" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" id="password" autocomplete="current-password" placeholder="Password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="confirm_password">
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" id="confirm-password" autocomplete="new-password" placeholder="Confirm Password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="w-full">
            Continue
          </Button>
        </form>
        <p class="mt-6 text-center text-sm text-gray-600">
          By clicking continue, you agree to our 
          <a href="/terms" class="underline text-inherit hover:text-blue-500">Terms of Service</a> 
          and 
          <a href="/privacy" class="underline text-inherit hover:text-blue-500">Privacy Policy</a>.
        </p>
      </div>
    </div>
  </div>
</template>





