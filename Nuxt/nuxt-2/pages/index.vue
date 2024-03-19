<script setup lang="ts">
  import { Input } from '@/components/ui/input'
  import { useRouter } from 'vue-router';
  import { toTypedSchema } from '@vee-validate/zod'
  import * as z from 'zod'
  import { useForm } from 'vee-validate';

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const typedFormSchema = toTypedSchema(formSchema)

  const { handleSubmit } = useForm({
  validationSchema: typedFormSchema,
})

  const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
  })

  const router = useRouter();

    const goToSignUp = () => {
    router.push('/SignUp');
    };

  const userlogin = () => {
    router.push('/Dashboard');
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

      <!-- Sign Up Button at the top right of the page -->
    <div class="absolute top-0 right-0 pt-4 pr-4">
      <Button @click="goToSignUp" variant="ghost">
        Sign Up
      </Button>
    </div>

  <div class="flex h-screen overflow-hidden lg:grid lg:grid-cols-2">
    <!-- Revised dark section with accurate text styling -->
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
            &ldquo;There is no strategy i have no strategy, there's zero strategy .&rdquo;
          </p>
          <footer class="text-sm font-medium">
            — Doland tremp
          </footer>
        </blockquote>
      </div>
    </div>
    
    <!-- Form section on the right -->
    <div class="flex flex-col justify-center lg:min-h-screen">
    <div class="p-8 mx-auto w-full max-w-md">
      <h1 class="text-2xl font-semibold text-center">Log In</h1>
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
        <Button type="submit" class="w-full">
          Continue
        </Button>
      </form>
      <div class="mt-8">

  <!-- Divider with 'Or continue with' text -->
      <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t"/>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
  <!-- Button for alternative login method -->
      <div class="mt-6 grid grid-cols-1 gap-4">
        <Button @click="userlogin" >
          <img src="@/assets/img/okta.svg" alt="Okta" class="h-5 w-5 mr-1" />
          <span> Okta</span>
        </Button>
      </div>
    </div>
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





