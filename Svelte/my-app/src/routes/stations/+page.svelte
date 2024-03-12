<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<!-- Stations -->
<div class="card w-90 bg-base-100 shadow-xl ml-2.5 mr-2.5 mt-2.5 mb-20">
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
                                <td>
                                    <button class="btn btn-info w-24 h-12">Reserve</button>
                                </td>
                            {:else if port.chargingPortStatus === 'Charging'}
                                <td>
                                    <button class="btn w-24 h-12">Request</button>
                                </td>
                            {:else if port.chargingPortStatus === 'Out of order'}
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
    </div>
</div>
