<script setup lang="ts">
  import { Input } from '@/components/ui/input'
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
            &ldquo;Pee is stored in the balls.&rdquo;
          </p>
          <footer class="text-sm font-medium">
            — Gingus Khan
          </footer>
        </blockquote>
      </div>
    </div>
    
    <!-- Form section on the right -->
    <div class="flex flex-col justify-center lg:min-h-screen">
      <div class="p-8 mx-auto w-full max-w-md">
        <h1 class="text-2xl font-semibold text-center">Create an account</h1>
        <Form class="mt-8 space-y-6">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <Input type="email" placeholder="Email" />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <Input type="password" name="password" id="password" autocomplete="current-password" placeholder="Password" />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <Input type="confirm password" name="comfirm password" id="confirm password" autocomplete="current-password" placeholder="Confirm Password" />
          </div>
          <Button type="submit" >
            Continue
          </Button>
        </Form>
        <p class="mt-6 text-center text-sm text-gray-600">
          By clicking continue, you agree to our 
          <a href="/terms" class="underline text-indigo-600 hover:text-indigo-500">Terms of Service</a> 
          and 
          <a href="/privacy" class="underline text-indigo-600 hover:text-indigo-500">Privacy Policy</a>.
        </p>
      </div>
    </div>
  </div>
</template>





