<script lang="ts">
    import {mobile} from '../mobile/mobile';
    import {onDestroy, onMount} from 'svelte';
    import {userId} from "../../store";

    $: isMobile = $mobile;

    let currentUserId: string | null;
    let unsubscribe: () => void;
    let pageData: any[] = [];

    onMount(() => {
        unsubscribe = userId.subscribe(value => {
            currentUserId = value;
        });

        if (currentUserId !== null) {
            getPorts();
        }
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    async function getPorts() {
        const response = await fetch('/api/ports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUserId,
            })
        });

        if (response.status === 201) {
            const data = await response.json();
            pageData = data;
        }
    }

    async function disconnectPort(portId: string, stationId: string) {
        const response = await fetch('/api/ports/disconnect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                portId: portId,
                stationId: stationId,
            })
        });

        if (response.status === 201) {
            const data = await response.json();
            console.log(data);
            pageData = pageData.filter(port => port.portId !== portId);
        }
    }
</script>


<!-- Ports -->
{#if !isMobile}
    <div class="flex items-center justify-center h-screen">
        <div class="flex-grow flex w-full items-center h-screen">
            <div class="card bg-base-100 h-60 w-2/5 shadow-xl mx-auto">
                <div class="w-full card-body">
                    <h2 class="card-title">My Port</h2>
                    {#if pageData.length === 0}
                        <div class="chat chat-start">
                            <div class="chat-bubble">It's kind of empty</div>
                        </div>
                        <div class="chat chat-end">
                            <div class="chat-bubble">Yes it is</div>
                        </div>
                    {:else}
                        <table id="ports-table" class="table">
                            <thead class="bg-base-200">
                            <tr>
                                <th>Port</th>
                                <th>Station ID</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody class="">
                            {#each pageData as port}
                                <tr class="w-full max-h-min p-1">
                                    <td class="p-2">{port.displayName}</td>
                                    <td class="p-2">{port.stationId}</td>
                                    <td class="p-2 flex justify-end">
                                        <button class="btn w-24 btn-error"
                                                on:click={() => disconnectPort(port.portId, port.stationId)}>Disconnect
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                            </tbody>
                        </table>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{:else}
{/if}