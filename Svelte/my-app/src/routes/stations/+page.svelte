<script lang="ts">
    import type {PageData} from './$types';

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
</script>

<!-- Ports -->
<div class="flex items-center justify-center h-screen">
    <div class="w-3/4">
        <div class="card bg-base-100 shadow-xl mx-auto mt-2.5">
            <div class="card-body">
                <h2 class="card-title">Ports</h2>
                <div class="overflow-x-auto">
                    <table class="table">
                        <!-- head -->
                        <thead>
                        <tr>
                            <th>Port ID</th>
                            <th>Station ID</th>
                            <th>Emi3 ID</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                        </thead>
                        <!-- body -->
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
                        <button class="join-item btn" on:click={() => goToPage(i + 1)}>{i + 1}</button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>