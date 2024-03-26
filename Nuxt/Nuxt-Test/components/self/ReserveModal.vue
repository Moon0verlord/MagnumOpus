<script setup lang="ts">
import { watch, ref, defineProps, defineEmits } from 'vue'
import type {Port} from "~/db/schemas/schubergSchema";
import {v4 as uuidv4} from "uuid";
const open = ref(false)
const loading = ref(false)

const props = defineProps({
  modelValue: Boolean,
  portId: String
})

const emit = defineEmits(['update:modelValue', 'reserveDone']);

watch(
    () => props.modelValue,
    (newVal) => {
      open.value = newVal
    }
)

watch(
    () => open.value,
    (newVal) => {
      emit('update:modelValue', newVal)
    }
)

function onReserve () {
  try {
    loading.value = true
    $fetch('api/ports', {
      method: "POST",
      body: {
        portId: props.portId,
      }
    });
    loading.value = false
    open.value = false
    emit('reserveDone')
  }
  catch (err: any) {
    console.log(err);
    loading.value = false
    open.value = false
  }
}

const title = computed(() => `Reserve Port ${props.portId}`)
</script>

<template>
  <UDashboardModal
      v-model="open"
      :title="title"
      description="Are you sure you want to reserve this port?"
      icon="i-heroicons-exclamation-circle"
      :ui="{
      icon: { base: 'text-green-500 dark:text-green-400' } as any,
      footer: { base: 'ml-16' } as any
    }"
  >
    <template #footer>
      <UButton color="green" label="Reserve" :loading="loading" @click="onReserve" />
      <UButton color="white" label="Cancel" @click="open = false" />
    </template>
  </UDashboardModal>
</template>