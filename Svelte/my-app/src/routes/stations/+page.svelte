<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<!-- Search Bar -->
<label class="input input-bordered flex items-center gap-2 ml-2.5 mr-2.5 mt-2.5">
    <input type="text" class="grow" placeholder="Search" />
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
</label>

<!-- Stations -->
<div class="card w-90 min-h-full bg-base-100 shadow-xl  ml-2.5 mr-2.5 mt-2.5">
    <div class="card-body">
        <h2 class="card-title">Stations</h2>
        <div class="overflow-x-auto">
            <table class="table">
                <!-- head -->
                <thead>
                <tr>
                    <th>Number</th>
                    <th>Speed</th>
                    <th>Status</th>
                    <th></th>
                </tr>
                </thead>
                <!-- body -->
                <tbody>
                {#each data.chargingPorts as port}
                    <tr>
                        <td>{port.chargingPortId}</td>
                        <td>{port.chargingPortNumber}</td>
                        <td>{port.chargingPortSpeed}</td>
                        <td>{port.chargingPortStatus}</td>
                        <td>
                            {#if port.chargingPortStatus === 'Available'}
                                <td><button class="btn btn-info w-24 h-12">Reserve</button></td>
                            {:else if port.chargingPortStatus === 'Charging'}
                                <td><button class="btn w-24 h-12">Request</button></td>
                            {:else if port.chargingPortStatus === 'Out of order'}
                                <td><button class="btn btn-error w-24 h-12">Report</button></td>
                            {/if}
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
