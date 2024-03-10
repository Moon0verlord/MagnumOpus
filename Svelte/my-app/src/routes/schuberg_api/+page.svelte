<script lang="ts">
    import { onMount } from 'svelte';
    import type { DataItem } from "$lib/server/db/types";

    let data: DataItem[] = [];
    let isLoading = true;

    onMount(async () => {
        const res = await fetch("/api/schuberg_api", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Skibidi Toilet'
            }
        });
        const fetchedData = await res.json();
        data = fetchedData.stationList;
        isLoading = false;
    });
</script>

<style>
    .nested {
        padding-left: 20px;
    }
</style>

<!-- API -->
<div class="card w-90 min-h-full bg-base-100 shadow-xl  ml-2.5 mr-2.5 mt-2.5 mb-20">
    <div class="card-body">
        <h2 class="card-title">API</h2>
        <div class="overflow-x-auto">
            {#if isLoading}
                <div class="loading loading-spinner"></div>
            {:else}
                {#each data as item, i (item.id)}
                    <ul>
                        <li><strong>ID:</strong> {item.id || 'null'}</li>
                        <li><strong>Reference:</strong> {item.reference || 'null'}</li>
                        <li><strong>Location ID:</strong> {item.locationId || 'null'}</li>
                        <li><strong>Status:</strong> {item.status || 'null'}</li>
                        <li><strong>Coordinates:</strong>
                            <ul class="nested">
                                <li><strong>Latitude:</strong> {item.coordinates ? item.coordinates.lng : 'null'}</li>
                                <li><strong>Longitude:</strong> {item.coordinates ? item.coordinates.lat : 'null'}</li>
                            </ul>
                        </li>
                        <li><strong>Address:</strong>
                            <ul class="nested">
                                <li><strong>State:</strong>{item.address ? item.address.state : 'null'}</li>
                                <li><strong>Street:</strong> {item.address ? item.address.streetName : 'null'}</li>
                                <li><strong>City:</strong> {item.address ? item.address.city : 'null'}</li>
                                <li><strong>Postal Code:</strong> {item.address ? item.address.postcode : 'null'}</li>
                                <li><strong>Country:</strong>
                                    <ul class="nested">
                                        <li><strong>Code:</strong> {item.address ? item.address.country.code : 'null'}</li>
                                        <li><strong>Name:</strong> {item.address ? item.address.country.name : 'null'}</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li><strong>Max Power:</strong> {item.maxPower || 'null'}</li>
                        <li><strong>Visibility Scope:</strong> {item.visibilityScope || 'null'}</li>
                        <li>
                            <strong>EVSEs:</strong>
                            <ul class="nested">
                                {#each item.evses as evse, j (evse.id)}
                                    <li><strong>ID:</strong> {evse.id || 'null'}</li>
                                    <li><strong>EMI3ID:</strong> {evse.emi3Id || 'null'}</li>
                                    <li><strong>Status:</strong> {evse.status || 'null'}</li>
                                    <li><strong>Connector ID:</strong> {evse.connectors || 'null'}</li>
                                    {@html j < item.evses.length - 1 ? '<div class="divider"></div>' : ''}
                                {/each}
                            </ul>
                        </li>
                        <li>
                            <strong>Connectors:</strong>
                            <ul class="nested">
                                {#each item.connectors as connector, k}
                                    <li><strong>Status:</strong> {connector.status || 'null'}</li>
                                    <li><strong>Type:</strong> {connector.type || 'null'}</li>
                                    <li><strong>Format:</strong> {connector.format || 'null'}</li>
                                    {@html k < item.connectors.length - 1 ? '<div class="divider"></div>' : ''}
                                {/each}
                            </ul>
                        </li>
                    </ul>
                    {@html i < data.length - 1 ? '<div class="divider"></div>' : ''}
                {/each}
            {/if}
        </div>
    </div>
</div>