<script lang="ts">
    import {mobile} from '../mobile/mobile';
    import {onDestroy, onMount} from 'svelte';
    import {userId} from "../../store";

    $: isMobile = $mobile;

    let currentUserId: string | null;
    let unsubscribe: () => void;
    let pageData: any[] = [];
    let requestPageData: any[] = [];
    let incomingRequests: any[] = [];

    onMount(() => {
        unsubscribe = userId.subscribe(value => {
            currentUserId = value;
        });

        if (currentUserId !== null) {
            getPorts();
            myRequests();
            getIncomingRequests();
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
            pageData = await response.json();
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

    async function myRequests() {
        const response = await fetch('/api/requests/myRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUserId,
            })
        });

        if (response.status === 201) {
            requestPageData = await response.json();
        }
    }

    async function cancelRequest(requestId: number) {
        const response = await fetch('/api/requests/cancelRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requestId: requestId,
            })
        });

        if (response.status === 201) {
            const data = await response.json();
            console.log(data);
            requestPageData = requestPageData.filter(request => request.requestId !== requestId);
        }
    }

    async function getIncomingRequests() {
        const response = await fetch('/api/requests/incomingRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUserId,
            })
        });

        if (response.status === 201) {
            incomingRequests = await response.json();
        }
    }

    async function approveRequest(fromUserId: string, requestedPortId: number) {
        const response = await fetch('/api/requests/acceptRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromUserId: fromUserId,
                requestedPortId: requestedPortId,
            })
        });

        if (response.status === 201) {
            const data = await response.json();
            console.log(data);
            // clear page data and incoming data
            incomingRequests = incomingRequests.filter(request => request.requestedPortId !== requestedPortId);
            pageData = pageData.filter(port => port.portId !== requestedPortId);
        }
    }
</script>


<!-- Ports -->
{#if !isMobile}
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="card bg-base-100 w-3/6 shadow-xl mx-auto">
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
        <div class="card bg-base-100 w-3/6 shadow-xl mx-auto mt-2.5">
            <div class="w-full card-body">
                <h2 class="card-title">My Requests</h2>
                {#if requestPageData.length === 0}
                    <div class="chat chat-start">
                        <div class="chat-bubble">No requests to be seen here</div>
                    </div>
                    <div class="chat chat-start">
                        <div class="chat-bubble">:)</div>
                    </div>
                {:else}
                    <table id="ports-table" class="table">
                        <thead class="bg-base-200">
                        <tr>
                            <th>Port</th>
                            <th>Priority</th>
                            <th>Message</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody class="">
                        {#each requestPageData as request}
                            <tr class="p-1">
                                <td class="p-2">{request.displayName}</td>
                                <td class="p-2">
                                    {#if request.priority === "high"}
                                        <span class="badge badge-error">High</span>
                                    {:else if request.priority === "medium"}
                                        <span class="badge badge-warning">Medium</span>
                                    {:else}
                                        <span class="badge badge-success">Low</span>
                                    {/if}
                                </td>
                                <td class="p-2 break-all">
                                    <div class={`${request.message.length >= 25 ? 'h-12' : ''} p-1 overflow-y-auto`}>
                                        {request.message}
                                    </div>
                                </td>
                                <td class="p-2 flex justify-end">
                                    <button class="btn w-24 btn-error"
                                            on:click={() => cancelRequest(request.requestId)}>Cancel
                                    </button>
                                </td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                {/if}
            </div>
        </div>
        <div class="card bg-base-100 w-3/6 shadow-xl mx-auto mt-2.5">
            <div class="w-full card-body">
                <h2 class="card-title">Incoming Requests</h2>
                {#if incomingRequests.length === 0}
                    <div class="chat chat-start">
                        <div class="chat-bubble">No incoming requests to be seen here</div>
                    </div>
                    <div class="chat chat-start">
                        <div class="chat-bubble">:(</div>
                    </div>
                {:else}
                    <table id="ports-table" class="table">
                        <thead class="bg-base-200">
                        <tr>
                            <th>Port</th>
                            <th>Priority</th>
                            <th>Message</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody class="">
                        {#each incomingRequests as request}
                            <tr class="p-1">
                                <td class="p-2">{request.displayName}</td>
                                <td class="p-2">
                                    {#if request.priority === "high"}
                                        <span class="badge badge-error">High</span>
                                    {:else if request.priority === "medium"}
                                        <span class="badge badge-warning">Medium</span>
                                    {:else}
                                        <span class="badge badge-success">Low</span>
                                    {/if}
                                </td>
                                <td class="p-2 break-all">
                                    <div class={`${request.message.length >= 25 ? 'h-12' : ''} p-1 overflow-y-auto`}>
                                        {request.message}
                                    </div>
                                </td>
                                <td class="p-2 flex justify-end">
                                    <button class="btn w-24 btn-success"
                                            on:click={() => approveRequest(request.fromUserId ,request.requestedPortId)}>Approve
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
{:else}
{/if}