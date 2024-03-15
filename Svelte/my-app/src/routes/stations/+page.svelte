<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<!-- Ports -->
<div class="card w-90 bg-base-100 shadow-xl ml-2.5 mr-2.5 mt-2.5 mb-20">
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
                {#each data.props.chargingPorts as port}
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
    </div>
</div>