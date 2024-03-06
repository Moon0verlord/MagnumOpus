<script setup lang="ts">
import type {StationData} from "~/composables/useTypes";
import {awaitExpression} from "@babel/types"; 

const columns = [{
    key: 'id',
    label: 'ID',
    sortable: true,
  },
  {
    key: 'maxPower',
    label: 'Max Power',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    key: 'actions',
  }
];

const {data, error, pending} = useAsyncData('poi-locations', () => {
  return fetch('https://schubergphilis.workflows.okta-emea.com/api/flo/d71da429cdb215bef89ffe6448097dee/invoke?clientToken=01d762901510b3c7f422595fa18d8d7bd71c1f3e58ad860fd3ae2d0c87a80955&url=/poi/v1/locations&method=GET')
      .then(response => response.json())
      .then(responseData => responseData.stationList as StationData[]);
})
if (error) {
  console.log(error)
} else if (pending) {
  console.log("pending")
} else {

}

let buttonColor = ref('green');
const changeButtonColor = (row: StationData) => {
  if (row.status === 'out of order' || row.status === 'unknown')
    buttonColor = ref('gray');
  else if (row.status === 'charging')
    buttonColor = ref('sky')
  else buttonColor = ref('green');
}

const page = ref(1)
const pageCount = 8

const rows = computed(() => {
  if (data.value != null)
    return data.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
  return [];
})
</script>

<template>
  <div class="flex justify-center align-middle mt-10">
    <div class="max-w-4xl">
      <UTable
          :loading="pending"
          :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
          :progress="{ color: 'primary', animation: 'carousel' }"
          class="border border-gray-600 rounded-lg"
          :columns="columns"
          :rows="data == null || pending ? [] : rows"
      >
      <template #actions-data="{ row }">
        {{ changeButtonColor(row) }}
        <UButton :disabled="row.status === 'out of order' || row.status === 'unknown'" @click=""
          :color="buttonColor"
        >
          {{ row.status === 'available' ? 'Reserve' : row.status === 'charging' ? 'Request' : 'Unavailable' }}
        </UButton>
      </template>
      </UTable>
      <UPagination 
          class="flex justify-end " 
          v-model="page" :page-count="pageCount" 
          :total="data === null || pending ? 0 : data.length"
          :inactive-button="{ color: 'gray' }"
      />
    </div>
  </div>
</template>

<style scoped>

</style>