<script setup lang="ts">
import { showNotification } from "~/electron/files/notif";


</script>

<template>
  <div class="w-96 h-96 flex">
    <div class="flex flex-col align-middle p-5">
      <UButton class="w-max h-max" @click="showNotification">
        Notification Tryout on App!
      </UButton>
      <p id="output"></p>
    </div>
  </div>

</template>

<style scoped>

</style>

