<script setup lang="ts">
const columns = [{
  key: 'id',
  label: 'ID',
},
  {
    key: 'max_power',
    label: 'Max Power'
  },
  {
    key: 'status',
    label: 'Status'
  }
];

interface StationData {
  id: string;
  locationId: string;
  reference: string | null;
  status: string;
  coordinates: {
    lng: number;
    lat: number;
  };
  address: {
    state: string | null;
    streetName: string;
    postcode: string;
    city: string;
    country: {
      code: string;
      name: string;
    };
  };
  maxPower: number;
  evses: {
    id: string;
    emi3Id: string;
    status: string;
    connectors: Array<any>;
  }[];
  connectors: {
    status: string;
    type: string;
    format: string;
  }[];
  visibilityScope: string;
  accountId: string | null;
  externalAccountId: string | null;
  externalParentAccountId: string | null;
}

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

const dummy = [{
  id: 1,
  max_power: 300,
  status: 'available'
}, {
  id: 1,
  max_power: 300,
  status: 'available'
}, {
  id: 1,
  max_power: 300,
  status: 'available'
},]
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
          :rows="data == null || pending ? [] : data"
          />
    </div>
  </div>
</template>

<style scoped>

</style>