<script lang="ts">
    import {mobile} from '../mobile/mobile';
    import {onDestroy, onMount} from 'svelte';
    import {userId} from "../../store";
    import oktaAuth from '../../oktaAuth';
    import type {AccessToken, IDToken, UserClaims,} from '@okta/okta-auth-js';
    import type {Port, User} from "$lib/server/db/types";

    let requestPageData: any[] = [];
    let incomingRequests: any[] = [];
    let allRequestData: any[] = [];
    let allOccupiedPorts: any[] = [];

    let response;
    let curPort: Port;
    let user: User;

    $: isMobile = $mobile;
    let userInfo: UserClaims | null = null;
    let currentUserId: string | null = null;
    let currentUserIsAdmin: boolean | null = null;
    let currentUserInfo: User | null;
    let unsubscribe: () => void;
    let pageData: any[] = [];


    async function getOktaUserInfo() {
        try {
            const accessToken = await oktaAuth.tokenManager.get('accessToken') as AccessToken;
            const idToken = await oktaAuth.tokenManager.get('idToken') as IDToken;
            userInfo = await oktaAuth.token.getUserInfo(accessToken, idToken);
        } catch (error) {
            console.error('Error getting user info:', error);
        }
    }

    async function CheckUserExists() {
        if (userInfo && userInfo.email) {
            const response = await fetch(`/api/home`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'email': (userInfo ? userInfo.email : '')
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.email === (userInfo ? userInfo.email : null)) {
                    return true;
                } else {
                    console.error('Email does not match');
                    return false;
                }
            }
        }
    }

    async function PostOktaToDB() {
        let userExists = await CheckUserExists();

        if (userExists) {
            console.log('User already exists in DB');
            return;
        }

        if (userInfo) {
            const response = await fetch('/api/home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                    oktaId: userInfo.sub
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // "Success"
                console.log(data.uuid); // user's UUID
                userId.set(data.uuid);
            } else {
                console.error('Failed to post user to DB');
            }
        } else {
            console.error('User info is null');
        }
    }

    onMount(async () => {
        await getOktaUserInfo();
        await PostOktaToDB();
        unsubscribe = userId.subscribe(value => {
            currentUserId = value;
        });
        if (!currentUserId) {
            if (userInfo && userInfo.email) {
                const response = await fetch(`/api/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'email': (userInfo ? userInfo.email : '')
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    userId.set(data.uuid);
                }
            }

        }
        if (currentUserId !== null) {
            await getPorts();
            await myRequests();
            await getIncomingRequests();
        }
    });


    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    $: if (currentUserId) {
        UserAdminCheck(currentUserId).then(isAdmin => currentUserIsAdmin = isAdmin);
        PopulateUser(currentUserId).then(user => currentUserInfo = user);
        if (currentUserIsAdmin) {
            adminAllRequests();
            adminAllOccupiedPorts()
        }
    }

    async function PopulateUser(id: string) {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: id
            })
        });
        const data = await response.json();
        return data.user;
    }

    async function UserAdminCheck(id: string) {
        const response = await fetch('/api/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: id
            })
        });
        const data = await response.json();
        return data.isAdmin;
    }

    async function getPorts() {
        const response = await fetch(`/api/ports?id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            pageData = await response.json();
        }
    }

    async function disconnectPort(portId: string, stationId: string) {
        const response = await fetch('/api/ports', {
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
            allOccupiedPorts = allOccupiedPorts.filter(port => port.portId !== portId);
        }
    }

    async function myRequests() {
        const response = await fetch(`/api/requests?id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
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
            allRequestData = allRequestData.filter(request => request.requestId !== requestId);
        }
    }

    async function getIncomingRequests() {
        const response = await fetch(`/api/requests/incomingRequests?id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
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
            allRequestData = allRequestData.filter(request => request.requestedPortId !== requestedPortId);
        }
    }

    async function adminAllRequests() {
        const response = await fetch(`/api/requests/allRequests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            allRequestData = await response.json();
        }
    }

    async function adminAllOccupiedPorts() {
        const response = await fetch(`/api/ports/allOccupiedPorts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            allOccupiedPorts = await response.json();
        }
    }
</script>
{#if currentUserIsAdmin}
    {#if !isMobile}
        <div class="flex justify-center items-center h-screen mx-3">
            <div class="grid grid-rows-3 grid-flow-col gap-4">
                <div class="col-span-2">
                    <div class="card bg-base-100 h-full min-h-52 shadow-xl">
                        <div class="w-full card-body">
                            <div class="m-auto">
                                {#if currentUserInfo}
                                    <h1 class="card-title text-5xl">Welcome {currentUserInfo.name}</h1>
                                {:else}
                                    <h1 class="card-title text-5xl">Welcome Guest</h1>
                                {/if}
                                <p>So glad to see you! Let's get started with managing people's sessions.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row-span-2">
                    <div class="card bg-base-100 h-full shadow-xl">
                        <div class="w-full card-body">
                            <h2 class="card-title">Requests</h2>
                            {#if allRequestData.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">No requests to be seen here</div>
                                </div>
                                <div class="chat chat-start">
                                    <div class="chat-bubble">:(</div>
                                </div>
                            {:else}
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                        <tr>
                                            <th>Port</th>
                                            <th>Priority</th>
                                            <th>User</th>
                                            <th>Message</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
                                        {#each allRequestData as request}
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
                                                <td class="p-2">
                                                    {request.name}
                                                </td>
                                                <td class="p-2">
                                                    <label for="my_modal_{request.requestId}" class="btn">Show Message</label>
                                                    <input type="checkbox" id="my_modal_{request.requestId}" class="modal-toggle"/>
                                                    <div class="modal" role="dialog">
                                                        <div class="modal-box">
                                                            <h3 class="font-bold text-lg">Message</h3>
                                                            <p class="py-4 overflow-y-auto max-h-40">{request.message}</p>
                                                            <div class="modal-action">
                                                                <label for="my_modal_{request.requestId}" class="btn">Close</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="p-2 justify-end">
                                                    <button class="btn w-20 text-xs btn-success"
                                                            on:click={() => approveRequest(request.fromUserId ,request.requestedPortId)}>Approve
                                                    </button>
                                                    <button class="btn w-20 text-xs btn-error"
                                                            on:click={() =>  cancelRequest(request.requestId)}>Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="row-span-2">
                    <div class="card bg-base-100 h-full shadow-xl">
                        <div class="w-full card-body">
                            <h2 class="card-title">Ports</h2>
                            {#if allOccupiedPorts.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">It's kind of empty</div>
                                </div>
                                <div class="chat chat-end">
                                    <div class="chat-bubble">Yes it is</div>
                                </div>
                            {:else}
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                        <tr>
                                            <th>Port</th>
                                            <th>Station ID</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
                                        {#each allOccupiedPorts as port}
                                            <tr class="p-1">
                                                <td class="p-2">{port.displayName}</td>
                                                <td class="p-2 break-all">{port.stationId}</td>
                                                <td class="p-2 justify-end">
                                                    <button class="btn w-24 btn-error"
                                                            on:click={() => disconnectPort(port.portId, port.stationId)}>
                                                        Disconnect
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="flex justify-center items-center h-screen">
            <div class="h-96 carousel carousel-vertical">
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
                            <div class="m-auto">
                                {#if currentUserInfo}
                                    <h1 class="card-title">Welcome {currentUserInfo.name}</h1>
                                {:else}
                                    <h1 class="card-title">Welcome Guest</h1>
                                {/if}
                                <p>So glad to see you! Let's get started with managing people's sessions.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title">Ports</h2>
                            {#if allOccupiedPorts.length === 0}
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
                                    <tbody class="bg-base-300">
                                    {#each allOccupiedPorts as port}
                                        <tr class="p-1">
                                            <td class="p-1 text-xs">{port.displayName}</td>
                                            <td class="p-1 text-xs break-all">{port.stationId}</td>
                                            <td class="p-1 justify-end">
                                                <button class="btn w-20 text-xs btn-error"
                                                        on:click={() => disconnectPort(port.portId, port.stationId)}>
                                                    Disconnect
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
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title">Requests</h2>
                            {#if allRequestData.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">No requests to be seen here</div>
                                </div>
                                <div class="chat chat-start">
                                    <div class="chat-bubble">:)</div>
                                </div>
                            {:else}
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                        <tr>
                                            <th>Port</th>
                                            <th>Priority</th>
                                            <th>Message</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
                                        {#each allRequestData as request}
                                            <tr class="p-1">
                                                <td class="p-1 text-xs">{request.displayName}</td>
                                                <td class="p-1">
                                                    {#if request.priority === "high"}
                                                        <span class="badge text-xs badge-error">High</span>
                                                    {:else if request.priority === "medium"}
                                                        <span class="badge text-xs badge-warning">Medium</span>
                                                    {:else}
                                                        <span class="badge text-xs badge-success">Low</span>
                                                    {/if}
                                                </td>
                                                <td class="p-1">
                                                    <label for="my_modal_{request.requestId}" class="btn text-xs">Show Message</label>
                                                    <input type="checkbox" id="my_modal_{request.requestId}" class="modal-toggle"/>
                                                    <div class="modal" role="dialog">
                                                        <div class="modal-box">
                                                            <h3 class="font-bold text-lg">Message</h3>
                                                            <p class="py-4 overflow-y-auto max-h-40">{request.message}</p>
                                                            <div class="modal-action">
                                                                <label for="my_modal_{request.requestId}" class="btn">Close</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="p-1 justify-end">
                                                    <button class="btn w-20 text-xs btn-success"
                                                            on:click={() => approveRequest(request.fromUserId ,request.requestedPortId)}>Approve
                                                    </button>
                                                    <button class="btn w-20 text-xs btn-error"
                                                            on:click={() =>  cancelRequest(request.requestId)}>Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
{:else}
    {#if !isMobile}
        <div class="flex justify-center items-center h-screen mx-3">
            <div class="grid grid-rows-3 grid-flow-col gap-4">
                <div class="">
                    <div class="card bg-base-100 h-full min-h-52 shadow-xl">
                        <div class="w-full card-body">
                            <div class="m-auto">
                                {#if currentUserInfo}
                                    <h1 class="card-title text-5xl">Welcome {currentUserInfo.name}</h1>
                                {:else}
                                    <h1 class="card-title text-5xl">Welcome Guest</h1>
                                {/if}
                                <p>So glad to see you! Let's get started with managing your session.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row-span-2">
                    <div class="card bg-base-100 h-full shadow-xl">
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
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                        <tr>
                                            <th>Port</th>
                                            <th>Priority</th>
                                            <th>Message</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
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
                                                <td class="p-2">
                                                    <label for="my_modal_{request.requestId}" class="btn">Show Message</label>
                                                    <input type="checkbox" id="my_modal_{request.requestId}" class="modal-toggle"/>
                                                    <div class="modal" role="dialog">
                                                        <div class="modal-box">
                                                            <h3 class="font-bold text-lg">Message</h3>
                                                            <p class="py-4 overflow-y-auto max-h-40">{request.message}</p>
                                                            <div class="modal-action">
                                                                <label for="my_modal_{request.requestId}" class="btn">Close</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="p-2 justify-end">
                                                    <button class="btn w-24 btn-success"
                                                            on:click={() => approveRequest(request.fromUserId ,request.requestedPortId)}>
                                                        Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="">
                    <div class="card bg-base-100 h-full min-h-52 shadow-xl">
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
                                    <tbody class="bg-base-300">
                                    {#each pageData as port}
                                        <tr class="p-1">
                                            <td class="p-2">{port.displayName}</td>
                                            <td class="p-2 break-all">{port.stationId}</td>
                                            <td class="p-2 justify-end">
                                                <button class="btn w-24 btn-error"
                                                        on:click={() => disconnectPort(port.portId, port.stationId)}>
                                                    Disconnect
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
                <div class="row-span-2">
                    <div class="card bg-base-100 h-full shadow-xl">
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
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                        <tr>
                                            <th>Port</th>
                                            <th>Priority</th>
                                            <th>Message</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
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
                                                <td class="p-2">
                                                    <label for="my_modal_{request.requestId}" class="btn">Show Message</label>
                                                    <input type="checkbox" id="my_modal_{request.requestId}" class="modal-toggle"/>
                                                    <div class="modal" role="dialog">
                                                        <div class="modal-box">
                                                            <h3 class="font-bold text-lg">Message</h3>
                                                            <p class="py-4 overflow-y-auto max-h-40">{request.message}</p>
                                                            <div class="modal-action">
                                                                <label for="my_modal_{request.requestId}" class="btn">Close</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="p-2 justify-end">
                                                    <button class="btn w-24 btn-error"
                                                            on:click={() => cancelRequest(request.requestId)}>Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="flex justify-center items-center h-screen">
            <div class="h-96 carousel carousel-vertical">
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
                            <div class="m-auto">
                                {#if currentUserInfo}
                                    <h1 class="card-title">Welcome {currentUserInfo.name}</h1>
                                {:else}
                                    <h1 class="card-title">Welcome Guest</h1>
                                {/if}
                                <p>So glad to see you! Let's get started with managing your session.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
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
                                    <tbody class="bg-base-300">
                                    {#each pageData as port}
                                        <tr class="p-1">
                                            <td class="p-1 text-xs">{port.displayName}</td>
                                            <td class="p-1 text-xs break-all">{port.stationId}</td>
                                            <td class="p-1 justify-end">
                                                <button class="btn w-20 text-xs btn-error"
                                                        on:click={() => disconnectPort(port.portId, port.stationId)}>
                                                    Disconnect
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
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title">My Requests</h2>
                            {#if requestPageData.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">No requests to be seen here</div>
                                </div>
                                <div class="chat chat-start">
                                    <div class="chat-bubble">:)</div>
                                </div>
                            {:else}
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                        <tr>
                                            <th>Port</th>
                                            <th>Priority</th>
                                            <th>Message</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
                                        {#each requestPageData as request}
                                            <tr class="p-1">
                                                <td class="p-1 text-xs">{request.displayName}</td>
                                                <td class="p-1">
                                                    {#if request.priority === "high"}
                                                        <span class="badge text-xs badge-error">High</span>
                                                    {:else if request.priority === "medium"}
                                                        <span class="badge text-xs badge-warning">Medium</span>
                                                    {:else}
                                                        <span class="badge text-xs badge-success">Low</span>
                                                    {/if}
                                                </td>
                                                <td class="p-1">
                                                    <label for="my_modal_{request.requestId}" class="btn text-xs">Show Message</label>
                                                    <input type="checkbox" id="my_modal_{request.requestId}" class="modal-toggle"/>
                                                    <div class="modal" role="dialog">
                                                        <div class="modal-box">
                                                            <h3 class="font-bold text-lg">Message</h3>
                                                            <p class="py-4 overflow-y-auto max-h-40">{request.message}</p>
                                                            <div class="modal-action">
                                                                <label for="my_modal_{request.requestId}" class="btn">Close</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="p-1 justify-end">
                                                    <button class="btn w-20 text-xs btn-error"
                                                            on:click={() => cancelRequest(request.requestId)}>Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title">Incoming Requests</h2>
                            {#if incomingRequests.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">No incoming requests to be seen here</div>
                                </div>
                                <div class="chat chat-start">
                                    <div class="chat-bubble">:(</div>
                                </div>
                            {:else}
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                        <tr>
                                            <th>Port</th>
                                            <th>Priority</th>
                                            <th>Message</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
                                        {#each incomingRequests as request}
                                            <tr class="p-1">
                                                <td class="p-1 text-xs">{request.displayName}</td>
                                                <td class="p-1">
                                                    {#if request.priority === "high"}
                                                        <span class="badge text-xs badge-error">High</span>
                                                    {:else if request.priority === "medium"}
                                                        <span class="badge text-xs badge-warning">Medium</span>
                                                    {:else}
                                                        <span class="badge text-xs badge-success">Low</span>
                                                    {/if}
                                                </td>
                                                <td class="p-1">
                                                    <label for="my_modal_{request.requestId}" class="btn text-xs">Show Message</label>
                                                    <input type="checkbox" id="my_modal_{request.requestId}" class="modal-toggle"/>
                                                    <div class="modal" role="dialog">
                                                        <div class="modal-box">
                                                            <h3 class="font-bold text-lg">Message</h3>
                                                            <p class="py-4 overflow-y-auto max-h-40">{request.message}</p>
                                                            <div class="modal-action">
                                                                <label for="my_modal_{request.requestId}" class="btn">Close</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="p-1 justify-end">
                                                    <button class="btn w-20 text-xs btn-success"
                                                            on:click={() => approveRequest(request.fromUserId ,request.requestedPortId)}>
                                                        Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
{/if}