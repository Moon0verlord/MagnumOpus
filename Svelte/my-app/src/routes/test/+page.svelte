<script lang="ts">
    import type {PageData} from './$types';
    import {mobile} from '../mobile/mobile';
    import {slide} from 'svelte/transition';
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
</script>


<!-- Ports -->
{#if !isMobile}
    <div class="flex items-center justify-center h-screen">
        <div class="flex-grow flex w-full items-center h-screen">
            <div class="card bg-base-100 shadow-xl mx-auto">
                <div class="w-full card-body">
                    <h2 class="card-title">Stations</h2>
                    <div class="overflow-x-auto">
                        <table id="stations-table" class="table">
                            <thead class="bg-base-200">
                            <tr>
                                <th>Station</th>
                                <th>Power</th>
                                <th>No. of Ports</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody class="">
                            {#each currentPageData as station}
                                <tr class="">
                                    <td>{station.address ? JSON.parse(station.address.toString()).streetName : ''}</td>
                                    <td>{station.maxPower}</td>
                                    <td class="">
                                        <div class="">
                                            {station.portIds?.split(",").length} ports
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="badge p-3 {station.overallStatus === 'available' ? 'badge-success' : station.overallStatus === 'occupied' ? 'badge-error' : 'badge-ghost'}">
                                            {station.overallStatus}
                                        </div>
                                    </td>
                                    <td>
                                        <div class="collapse collapse-arrow">
                                            <input type="checkbox" checked={selectedStationId === station.stationId}
                                                   on:change={() => selectedStationId = (selectedStationId === station.stationId ? "" : station.stationId)}/>
                                            <div class="collapse-title"/>
                                        </div>
                                    </td>
                                </tr>
                                {#if selectedStationId === station.stationId}
                                    <tr>
                                        <td colspan="5">
                                            <div transition:slide={{duration: 200}}>
                                                <table class="table">
                                                    <thead class="bg-base-200 p-1">
                                                    <tr>
                                                        <th class="p-1">Port</th>
                                                        <th class="p-1">Status</th>
                                                        <th class="p-1"></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody class="bg-base-300">
                                                    {#each data.props.chargingPorts.filter(x => station.stationId === x.stationId).sort((a, b) => Number(a.displayName.split(' ').slice(-1) - Number(b.displayName.split(' ').slice(-1)))) as port}
                                                        <tr class="w-full max-h-min p-1">
                                                            <td class="p-2">{port.displayName}</td>
                                                            <td class="p-2">{port.status}</td>
                                                            <td class="p-2">
                                                                <button class="badge p-3 badge-success">
                                                                    button
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    {/each}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                {/if}
                            {/each}
                            </tbody>
                        </table>
                    </div>
                    <div class="join flex justify-center">
                        {#each Array(Math.ceil(data.props.stations.length / itemsPerPage)) as _, i (i)}
                                <button class="{i + 1 === currentPage ? 'join-item btn bg-base-300' : 'join-item btn'}"
                                        on:click={() => goToPage(i + 1)}>{i + 1}</button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
{:else}
{/if}
