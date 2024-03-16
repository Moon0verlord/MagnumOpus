// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: __dirname,
  extends: ['@nuxt/ui-pro'],
  modules: ['@vueuse/nuxt',
    "@vee-validate/nuxt", 
    "@nuxt/ui", 
    'nuxt-electron', 
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@sidebase/nuxt-auth'
  ],
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
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  ui: {
    icons: ['simple-icons', 'logos'],
  }
});