<script setup lang="ts">
import type {StationData} from "~/composables/useTypes";
import {awaitExpression} from "@babel/types";
import type {Port} from "~/db/schemas/schubergSchema";
import ReserveModal from "~/components/self/ReserveModal.vue"; 

const columns = [{
    key: 'portId',
    label: 'ID',
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

const {data, error, refresh, pending} = useAsyncData('ports-get', () => {
  return fetch('http://localhost:3000/api/ports')
      .then(response => response.json())
      .then(responseData => responseData.ports as Port[]);
})
if (error) {
  console.log(error)
} else if (pending) {
  console.log("pending")
} else {

}

let buttonColor = ref('green');
const changeButtonColor = (row: StationData) => {
  if (row.status === 'out of order' || row.status === 'unknown' || row.status === 'occupied')
    buttonColor = ref('gray');
  else if (row.status === 'charging')
    buttonColor = ref('sky')
  else buttonColor = ref('green');
}

const page = ref(1)
const pageCount = 8

let rows = computed(() => {
  if (data.value != null)
    return data.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
  return [];
})

watch(() => data.value, (newData) => {
  rows = computed(() => {
    if (data.value != null)
      return data.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    return [];
  })
});

const isReverseModalOpen = ref(false);
const portIdData = ref("");
function HandleButtonRequest(status: string, portId: string) {
  if (status === 'available')
  {
    isReverseModalOpen.value = true;
    portIdData.value = portId;
  }
  else if (status === 'charging')
  {
    
  }
}
</script>

<template>
  <div class="flex justify-center align-middle mt-10">
    <div class="max-w-4xl">
      <ReserveModal id="reserve" v-model="isReverseModalOpen" :port-id="portIdData" @reserveDone="refresh"/>
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
        <UButton :disabled="row.status === 'out of order' || row.status === 'unknown' || row.status === 'occupied'" @click="HandleButtonRequest(row.status, row.portId)" :color="buttonColor">
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