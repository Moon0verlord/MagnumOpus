// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', "@vee-validate/nuxt", "@nuxt/ui", 'nuxt-electron'],
  devtools: { enabled: true },
  alias: {
    '@': "/<rootDir>",
  },
  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
      },
    ],
  },
});