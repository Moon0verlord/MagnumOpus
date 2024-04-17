<script lang="ts">
    import {tick} from 'svelte';
    import type {PageData} from './$types';
    import {mobile} from '../mobile/mobile';
    import charger from "$lib/assets/MaterialSymbolsEvCharger.svg";
    import charge from "$lib/assets/SolarBatteryChargeBold.svg";
    import lock from "$lib/assets/MaterialSymbolsLockOpenRight.svg";

    $: isMobile = $mobile;
    export let data: PageData;

    let currentPage = 1; // Current page number
    const itemsPerPage = 5; // Number of items per page

    // Calculate start and end indices for slicing the data array
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    // Get the data for the current page
    let currentPageData = data.props.chargingPorts.slice(start, end);

    // Function to go to a specific page
    const goToPage = (page: any) => {
        currentPage = page;
        start = (currentPage - 1) * itemsPerPage;
        end = start + itemsPerPage;
        currentPageData = data.props.chargingPorts.slice(start, end);
    };
    let paginationFlag = false;
    let setFlag = () => paginationFlag = true;
</script>


<!-- Ports -->
{#if !isMobile}
    <div class="flex items-center justify-center h-screen">
<!--        <div class="mt-60 w-auto flex flex-col items-center justify-left h-screen pl-8">-->
<!--            <div class="card bg-base-100 shadow-xl h-4/6">-->
<!--                <div class="card-body flex flex-col gap-6">-->
<!--                    <span class="text-3xl"><b>Menu</b></span>-->
<!--                    <span class="flex"> -->
<!--            <img class="h-12 w-12" src={charger} alt="charge">-->
<!--             <span class="text-2xl">-->
<!--                schedule request-->
<!--            </span>-->
<!--          </span>-->
<!--                    <span class="flex"> -->
<!--            <img class="h-12 w-12" src={charge} alt="charge"> -->
<!--               <span class="text-2xl">-->
<!--                Charge status -->
<!--            </span>-->
<!--          </span>-->
<!--                    <span class="flex"> -->
<!--            <img class="h-12 w-12" src={lock} alt="charge"> -->
<!--            <span class="text-2xl">-->
<!--                Unlock connector -->
<!--            </span>-->
<!--          </span>-->
<!--                    <div>-->
<!--                        <p class="text-2xl font-bold gray-600">Charging</p>-->
<!--                        <div class="w-full accent-gray-700 rounded-full dark:bg-gray-700">-->
<!--                            <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 -->
<!--                                  leading-none rounded-full" style="width: 45%"> 45%</div>-->
<!--                        </div>-->
<!--                    </div>-->

<!--                    <div class="button-container flex flex-wrap gap-4">-->
<!--                        <p class="text-2xl font-bold gray-600">Sort charging list</p>-->
<!--                        <button> All Stations </button>-->
<!--                        <button> Available Now </button>-->
<!--                        <button> 15-30 min wait </button>-->
<!--                        <button> Fast Charger </button>-->
<!--                        <button> Slow Charger </button>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->

        <div class="flex-grow flex w-full items-center h-screen">
            <div class="card bg-base-100 shadow-xl mx-auto mt-2.5">
                <div class=" w-auto card-body">
                    <h2 class="card-title">Ports</h2>
                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                            <tr>
                                <th>Port ID</th>
                                <th>Station ID</th>
                                <th>Emi3 ID</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {#each currentPageData as port}
                                <tr>
                                    <td>{port.portId}</td>
                                    <td>{port.stationId}</td>
                                    <td>{port.emi3Id}</td>
                                    <td>{port.status.toUpperCase()}</td>
                                    <td>
                                        {#if port.status === 'available'}
                                            <td>
                                                <button class="btn btn-info w-24 h-12">Reserve</button>
                                            </td>
                                        {:else if port.status === 'charging'}
                                            <td>
                                                <button class="btn w-24 h-12">Request</button>
                                            </td>
                                        {:else if port.status === 'out_of_order'}
                                            <td>
                                                <button class="btn btn-error w-24 h-12">Report</button>
                                            </td>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                            </tbody>
                        </table>
                    </div>
                    <div class="join flex justify-center">
                        {#each Array(Math.ceil(data.props.chargingPorts.length / itemsPerPage)) as _, i (i)}
                            {#if i === 0 || i === Math.ceil(data.props.chargingPorts.length / itemsPerPage) - 1 || i === currentPage || (i >= currentPage - 3 && i <= currentPage + 1)}
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
    <div class="flex items-center justify-center h-screen">
        <div class="h-96 w-64 carousel carousel-vertical rounded-box">
            {#each data.props.chargingPorts as port}
                <div class="carousel-item flex flex-col justify-between">
                    <table class="table min-h-96 bg-base-300">
                        <thead>
                        <tr>
                            <th>Port ID</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{port.portId}</td>
                        </tr>
                        </tbody>
                        <thead>
                        <tr>
                            <th>Station ID</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{port.stationId}</td>
                        </tr>
                        </tbody>
                        <thead>
                        <tr>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{port.status.toUpperCase()}</td>
                        </tr>
                        {#if port.status === 'available'}
                            <div class="flex justify-center">
                                <button class="btn btn-info w-24 h-12 mt-12 mb-2.5">Reserve</button>
                            </div>
                        {:else if port.status === 'charging'}
                            <div class="flex justify-center">
                                <button class="btn w-24 h-12 mt-2.5 mb-2.5">Request</button>
                            </div>
                        {:else if port.status === 'out_of_order'}
                            <div class="flex justify-center">
                                <button class="btn btn-error w-24 h-12 mt-2.5 mb-2.5">Report</button>
                            </div>
                        {/if}
                        </tbody>
                    </table>
                </div>
            {/each}
        </div>
    </div>
{/if}