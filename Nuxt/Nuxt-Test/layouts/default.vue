<script setup lang="ts">
const route = useRoute();

const links = [
  [{
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/dashboard'
  }, {
    label: 'Charging Ports',
    icon: 'i-heroicons-chart-bar',
    to: '/ports'
  }, {
    label: 'Requests',
    icon: 'i-heroicons-arrows-right-left',
    to: '/requests'
  }, {
    label: 'API',
    icon: 'i-heroicons-command-line',
    to: '/api_page'
  }], [{
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth-20-solid',
    to: '/settings'
  }, {
    label: 'Profile',
    avatar: {
      src: 'https://www.reddit.com/media?url=https%3A%2F%2Fpreview.redd.it%2Fwere-bidone-v0-9offurtxifdb1.jpg'
    },
    to: '/profile'
  }]
]
</script>

<template>
    <div>
      <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800 space-around"/>
      <slot />
    </div>
</template>