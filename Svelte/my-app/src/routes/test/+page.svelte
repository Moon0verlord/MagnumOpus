<script lang="ts">
    import {tick} from 'svelte';
    import type {PageData} from './$types';
    import {mobile} from '../mobile/mobile';
    import charger from "$lib/assets/MaterialSymbolsEvCharger.svg";
    import charge from "$lib/assets/SolarBatteryChargeBold.svg";
    import lock from "$lib/assets/MaterialSymbolsLockOpenRight.svg";

    $: isMobile = $mobile;
    let selectedStationId: string = "";
    export let data: PageData;

    let currentPage = 1; // Current page number
    const itemsPerPage = 5; // Number of items per page

    // Calculate start and end indices for slicing the data array
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    // Get the data for the current page
    let currentPageData = data.props.stations.slice(start, end);

    // Function to go to a specific page
    const goToPage = (page: any) => {
        currentPage = page;
        start = (currentPage - 1) * itemsPerPage;
        end = start + itemsPerPage;
        currentPageData = data.props.stations.slice(start, end);
    };
    let paginationFlag = false;
    let setFlag = () => paginationFlag = true;
</script>


<!-- Ports -->
{#if !isMobile}
    <div class="flex items-center justify-center h-screen">
        <div class="flex-grow flex w-full items-center h-screen">
            <div class="card bg-base-100 shadow-xl mx-auto mt-2.5">
                <div class=" w-auto card-body">
                    <h2 class="card-title">Ports</h2>
                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                            <tr>
                                <th>Station ID</th>
                                <th>Power</th>
                                <th>Amount of Ports</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {#each currentPageData as station}
                                <tr>
                                    <td>{station.stationId}</td>
                                    <td>{station.maxPower}</td>
                                    <td>{station.portIds?.split(",").length}</td>
                                    <td class="badge badge-secondary">{station.overallStatus}</td>
                                    <td>
                                        <input type="checkbox" class="checkbox" checked={selectedStationId === station.stationId} on:change={() => selectedStationId = (selectedStationId === station.stationId ? "" : station.stationId)} />
                                    </td>
                                </tr>
                                {#if selectedStationId === station.stationId}
                                    {#each station.portIds.split(",") as port}
                                        <tr>
                                            <td class="badge badge-accent">Port: {port}</td>
                                        </tr>
                                    {/each}
                                {/if}
                            {/each}
                            </tbody>
                        </table>
                    </div>
                    <div class="join flex justify-center">
                        {#each Array(Math.ceil(data.props.stations.length / itemsPerPage)) as _, i (i)}
                            {#if i === 0 || i === Math.ceil(data.props.stations.length / itemsPerPage) - 1 || i === currentPage || (i >= currentPage - 3 && i <= currentPage + 1)}
                                <button class="{i + 1 === currentPage ? 'join-item btn bg-base-300' : 'join-item btn'}" on:click={() => goToPage(i + 1)}>{i + 1}</button>
                            {:else if i === currentPage - 4 || i === currentPage + 2}
                                <button class="join-item btn btn-disabled">...</button>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
{:else}
{/if}