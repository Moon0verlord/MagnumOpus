<script lang="ts">
    import type {PageData} from './$types';
    import {mobile} from '../mobile/mobile';
    import {slide} from 'svelte/transition';
    import {onDestroy, onMount} from 'svelte';
    import {userId} from "../../store";
    import type {Port} from "$lib/server/db/schema";
    import PortsModal from "$lib/components/dialogs/portsModal.svelte";
    import {MySqlTimestamp} from "drizzle-orm/mysql-core";

    let showModal = false;
    let portData: any;

    let currentUserId: string | null;
    let unsubscribe: () => void;

    onMount(() => {
        unsubscribe = userId.subscribe(value => {
            currentUserId = value;
        });
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    async function reservePort(port: any) {
        if (currentUserId === null) {
            return;
        }

        const response = await fetch('/api/stations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUserId,
                portId: port.portId,
                stationId: port.stationId
            })
        });

        if (response.status === 201) {
            const resData = await response.json();
            console.log(resData);

            // Update the port status

            const index = data.props.chargingPorts.findIndex((x: Port) => x.portId === port.portId);
            data.props.chargingPorts[index].status = 'occupied';
            data.props.chargingPorts[index].usedBy = currentUserId;
        

            // Update the station status
            if (data.props.chargingPorts.filter(x => x.stationId === port.stationId).every(x => x.status === 'occupied')) {
                const stationIndex = data.props.stations.findIndex(x => x.stationId === port.stationId);
                data.props.stations[stationIndex].overallStatus = 'occupied';
            }

        } else if (response.status === 202) {
            const resData = await response.json();
            console.log(resData);
        }
    }

    const openPort = (data: any) => {
        portData = data; // Update portData with the data you want to pass to the modal
        showModal = true; // Show the modal
    };

    $: isMobile = $mobile;
    let selectedStationId: string = "";
    export let data: PageData;

    let currentPage = 1; // Current page number
    const itemsPerPage = 5; // Number of items per page

    // Calculate start and end indices for slicing the data array
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    // Get the data for the current page
    $: currentPageData = data.props.stations.slice(start, end);

    // Function to go to a specific page
    const goToPage = (page: any) => {
        currentPage = page;
        start = (currentPage - 1) * itemsPerPage;
        end = start + itemsPerPage;
        currentPageData = data.props.stations.slice(start, end);
    };

    let itemsPerPageMobile = 5; // Number of items per page for mobile

    let totalPage = Math.ceil(data.props.stations.length / itemsPerPageMobile); // Total number of pages

    const goToPageMobile = (direction: string) => {
        if (direction === '«' && currentPage > 1) {
            currentPage--;
        } else if (direction === '»' && currentPage < totalPage) {
            currentPage++;
        }
        start = (currentPage - 1) * itemsPerPageMobile;
        end = start + itemsPerPageMobile;
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
                                            <input type="checkbox" disabled={showModal}
                                                   on:change={() => { if (!showModal) selectedStationId = (selectedStationId === station.stationId ? "" : station.stationId) }}/>
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
                                                        <th class="p-1 min-w-60 w-60 break-words">Port</th>
                                                        <th class="p-1">Status</th>
                                                        <th class="p-1"></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody class="bg-base-300">
                                                    {#each data.props.chargingPorts.filter(x => station.stationId === x.stationId) as port}
                                                        <tr class="w-full max-h-min p-1">
                                                            <td class="p-2">{port.displayName}</td>
                                                            <td class="p-2">{port.status}</td>
                                                            <td class="p-2 flex justify-end">
                                                                {#if port.status === 'occupied'}
                                                                    <button class="btn w-4/6 {port.usedBy === currentUserId ? 'btn-disabled' : 'btn-info'}"
                                                                            on:click={() => openPort(port)}>Request
                                                                    </button>
                                                                {/if}
                                                                {#if port.status === 'available'}
                                                                    <button class="btn w-4/6 btn-success"
                                                                            on:click={() => reservePort(port)}>Reserve
                                                                    </button>
                                                                {/if}
                                                                {#if port.status === 'unavailable'}
                                                                    <button class="btn w-4/6 btn-error">Report
                                                                    </button>
                                                                {/if}
                                                                <PortsModal show={showModal} data={portData}
                                                                            user={currentUserId}
                                                                            on:close={() => showModal = false}/>
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
    <div class="flex items-center justify-center h-screen">
        <div class="flex-grow flex w-full">
            <div class="card bg-base-100 mx-auto">
                <div class="card-body">
                    <h2 class="card-title">Stations</h2>
                    <div class="">
                        <table id="stations-table" class="table">
                            <thead class="bg-base-200">
                            <tr>
                                <th>Station</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody class="">
                            {#each currentPageData as station}
                                <tr class="p-1">
                                    <td class="p-1">
                                        <label for="my_modal_{station.stationId}" class="btn btn-ghost">
                                            {station.address ? JSON.parse(station.address.toString()).streetName : ''}
                                        </label>
                                        <input type="checkbox" id="my_modal_{station.stationId}" class="modal-toggle"/>
                                        <div class="modal" role="dialog">
                                            <div class="modal-box">
                                                <h3 class="font-bold text-lg">Info</h3>
                                                <table class="table">
                                                    <thead>
                                                    <tr>
                                                        <th>Power</th>
                                                        <th>No. of Ports</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>{station.maxPower}</td>
                                                        <td>{station.portIds?.split(",").length} ports</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <div class="modal-action">
                                                    <label for="my_modal_{station.stationId}" class="btn">Close</label>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-1">
                                        <div class="badge p-3 {station.overallStatus === 'available' ? 'badge-success' : station.overallStatus === 'occupied' ? 'badge-error' : 'badge-ghost'}">
                                            {station.overallStatus}
                                        </div>
                                    </td>
                                    <td class="p-1">
                                        <div class="collapse collapse-arrow z-0">
                                            <input type="checkbox" disabled={showModal}
                                                   on:change={() => { if (!showModal) selectedStationId = (selectedStationId === station.stationId ? "" : station.stationId) }}/>
                                            <div class="collapse-title z-0"/>
                                        </div>
                                    </td>
                                </tr>
                                {#if selectedStationId === station.stationId}
                                    <tr>
                                        <td colspan="5">
                                            <div transition:slide={{duration: 200}}>
                                                <div class="max-h-40 overflow-y-auto">
                                                <table class="table">
                                                    <thead class="bg-base-200 p-1">
                                                    <tr>
                                                        <th class="p-1">Port</th>
                                                        <th class="p-1">Status</th>
                                                        <th class="p-1"></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody class="bg-base-300">
                                                    {#each data.props.chargingPorts.filter(x => station.stationId === x.stationId) as port}
                                                        <tr class="p-1">
                                                            <td class="p-1">{port.displayName}</td>
                                                            <td class="p-1">{port.status}</td>
                                                            <td class="p-1 flex justify-end">
                                                                {#if port.status === 'occupied'}
                                                                    <button class="btn w-4/6 {port.usedBy === currentUserId ? 'btn-disabled' : 'btn-info'}"
                                                                            on:click={() => openPort(port)}>Request
                                                                    </button>
                                                                {/if}
                                                                {#if port.status === 'available'}
                                                                    <button class="btn w-4/6 btn-success"
                                                                            on:click={() => reservePort(port)}>Reserve
                                                                    </button>
                                                                {/if}
                                                                {#if port.status === 'unavailable'}
                                                                    <button class="btn w-4/6 btn-error">Report
                                                                    </button>
                                                                {/if}
                                                                <PortsModal show={showModal} data={portData}
                                                                            user={currentUserId}
                                                                            on:close={() => showModal = false}/>
                                                            </td>
                                                        </tr>
                                                    {/each}
                                                    </tbody>
                                                </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                {/if}
                            {/each}
                            </tbody>
                        </table>
                    </div>
                    <div class="join flex justify-center">
                        <div class="join">
                            <button class="join-item btn" on:click={() => goToPageMobile("«")}>«</button>
                            <button class="join-item btn">{currentPage}</button>
                            <button class="join-item btn" on:click={() => goToPageMobile("»")}>»</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}