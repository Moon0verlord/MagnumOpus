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
  },
  auth: {
    strategies: {
      okta: {
        scheme: 'oauth2',
        endpoints: {
          authorization: `${process.env.OKTA_DOMAIN}/oauth2/v1/authorize`,
          token: `${process.env.OKTA_DOMAIN}/oauth2/v1/token`,
          userInfo: `${process.env.OKTA_DOMAIN}/oauth2/v1/userinfo`
        },
        token: {
          property: 'access_token',
          type: 'Bearer'
        },
        clientId: process.env.OKTA_CLIENT_ID,
        clientSecret: process.env.OKTA_CLIENT_SECRET,
      }
    }
  }
});