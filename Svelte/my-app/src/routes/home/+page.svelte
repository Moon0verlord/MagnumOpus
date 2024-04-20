<script lang="ts">
import {mobile} from '../mobile/mobile';
import {onDestroy, onMount} from 'svelte';
import {userId} from "../../store";

import oktaAuth from '../../oktaAuth';
import type { OktaAuth, AccessToken, IDToken, UserClaims,} from '@okta/okta-auth-js';
import type {Port, User} from "$lib/server/db/types";
let requestPageData: any[] = [];
let incomingRequests: any[] = [];
let response;
let curPort:Port;
let user:User;
onMount(async () => {
    
    var currentUserId = sessionStorage.getItem('userId')
    console.log()
    response = await fetch(`/api/getuser?id=${currentUserId}`)
        .then((response) => {
        return  response.json();
    }).then((data:User) => {
        user = data;
     
    }).catch((error) => {
        console.error('Error:', error);
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
            curPort = data[0];
            
        }
    }
    await getPorts()
});


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
  if (userInfo && userInfo.email)
  {
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

  if(userExists) {
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
    if (!currentUserId)
    {
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

$: if (currentUserId) {
    UserAdminCheck(currentUserId).then(isAdmin => currentUserIsAdmin = isAdmin);
    PopulateUser(currentUserId).then(user => currentUserInfo = user);
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
<style>h1, h2, h3, h4, h5, h6 { font-family: 'Inter', sans-serif; --font-sans: 'Inter'; }
body { font-family: 'Inter', sans-serif; --font-sans: 'Inter'; }
</style>

{#if !isMobile}
        <div class="min-[512px]:items-center min-[512px]:justify-center flex overflow-auto pb-24 h-screen ">
            <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="rounded-lg bg-card text-card-foreground shadow-sm " data-v0-t="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                            <div class="rounded-lg border bg-card text-card-foreground pb-16 shadow-sm" data-v0-t="card">
                                <div class="p-6 flex flex-row items-center justify-between space-y-0 h-44" >
                                    {#if user}
                                        <h3 class="whitespace-nowrap tracking-tight text-5xl font-extrabold">Welcome {user.name}</h3>
                                    {:else}
                                        <h3 class="whitespace-nowrap tracking-tight text-5xl font-extrabold">Welcome guest</h3>
                                    {/if}
                                </div>
                                <!--Greeting User-->
                                <div class="pl-6 font-medium">
                                    So glad to see you again! Let's get started with your charging session.
                                </div>
                            </div>
                            <div class="rounded-lg border h-3/6 bg-card text-card-foreground overflow-auto shadow-sm pb-6" data-v0-t="card">
                                <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
                                    <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Recent Charging History</h3>
                                    <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="w-4 h-4 text-base-200/30  dark:text-gray-400"
                                    >
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                        <path d="M3 3v5h5"></path>
                                        <path d="M12 7v5l4 2"></path>
                                    </svg>
                                </div>
                                <div class="p-6">
                                    <div class="flex flex-col gap-2">
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 2</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                35 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 6</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 10, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                40 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 9</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 5, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                50 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 2</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                35 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 2</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                35 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 2</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                35 kWh
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                                <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
                                    <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Your Current Charging Session</h3>
                                    <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    >
                                        <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
                                        <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
                                        <path d="m11 7-3 5h4l-3 5"></path>
                                        <line x1="22" x2="22" y1="11" y2="13"></line>
                                    </svg>
                                </div>
                                {#if pageData.length > 0}
                                    <div class="p-6">
                                        {#each pageData as port}
                                            <div class="flex flex-col gap-2">
                                                <div class="flex items-center justify-between">

                                                    <div class="font-medium">{port.displayName}</div>
                                                    <div class="flex items-center gap-1 text-base-200/30  dark:text-gray-400">
                                                        <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                stroke-width="2"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                class="w-4 h-4"
                                                        >
                                                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                            <path d="M9 18h6"></path>
                                                            <path d="M10 22h4"></path>
                                                        </svg>
                                                        45 kWh
                                                    </div>
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <div class="font-medium">Estimated Time Remaining</div>
                                                    <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                        <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                stroke-width="2"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                class="w-4 h-4"
                                                        >
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <polyline points="12 6 12 12 16 14"></polyline>
                                                        </svg>
                                                        30 mins
                                                    </div>
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <div class="font-medium">Charging Status</div>
                                                    <div class="flex items-center gap-1 text-green-500 dark:text-green-400">
                                                        <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                stroke-width="2"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                class="w-4 h-4"
                                                        >
                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                        </svg>
                                                        Charging
                                                    </div>
                                                </div>
                                                <button class="btn w-24 btn-error"
                                                        on:click={() => disconnectPort(port.portId, port.stationId)}>Disconnect
                                                </button>
                                            </div>
                                        {/each}
                                    </div>

                                {:else}
                                    <div class="p-6">
                                        <div class="flex flex-col gap-2">
                                            <div class="flex items-center justify-between">
                                                <p>No current charging</p>
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    
                    <div class="rounded-lg bg-card text-card-foreground shadow-sm" data-v0-t="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                        <div class="card bg-base-100 w-5/6 shadow-xl pb-24 mx-auto mt-2.5">
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
<!--                        <div class="rounded-lg border bg-card text-card-foreground overflow-auto shadow-sm" data-v0-t="card">-->
<!--                            <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">-->
<!--                                <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Charging Requests</h3>-->
<!--                                <svg-->
<!--                                        xmlns="http://www.w3.org/2000/svg"-->
<!--                                        width="24"-->
<!--                                        height="24"-->
<!--                                        viewBox="0 0 24 24"-->
<!--                                        fill="none"-->
<!--                                        stroke="currentColor"-->
<!--                                        stroke-width="2"-->
<!--                                        stroke-linecap="round"-->
<!--                                        stroke-linejoin="round"-->
<!--                                        class="w-4 h-4 text-gray-500 dark:text-gray-400">-->
<!--                                    <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>-->
<!--                                    <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>-->
<!--                                    <path d="m11 7-3 5h4l-3 5"></path>-->
<!--                                    <line x1="22" x2="22" y1="11" y2="13"></line>-->
<!--                                </svg>-->
<!--                            </div>-->
<!--                            <div class="p-6">-->
<!--                                <div class="flex flex-col gap-2">-->
<!--                                    <a href="#" class="block max-w-2xl p-6 border bg-green-800 border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-green-800-->
<!--                       dark:border-gray-700 dark:hover:bg-green-900">-->
<!--                                                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request : Urgent</h5>-->
<!--                                                <p class="font-normal text-base-200/30  dark:text-gray-400">From : Bertha</p>-->
<!--                                                <p class="font-normal text-base-200/30  dark:text-gray-400">For : Port 4 of Station Oostlaan</p>-->
<!--                                                <p class="font-normal text-base-200/30  dark:text-gray-400">Reason : "Need it over 5 hours for full charge" </p>-->
<!--                                            </a>-->

<!--                                    <a href="#" class="block max-w-2xl p-6 bg-red-900 border border-gray-200-->
<!--                                    rounded-lg shadow hover:bg-gray-100 dark:bg-red-800 dark:border-gray-700 dark:hover:bg-red-900">-->
<!--                                                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request</h5>-->
<!--                                                <p class="font-normal text-base-200/30  dark:text-gray-400">From : Donald</p>-->
<!--                                                <p class="font-normal text-base-200/30  dark:text-gray-400">For : Port 3 of Station Oostlaan</p>-->
<!--                                                <p class="font-normal text-base-200/30  dark:text-gray-400">Reason : "Court case on 5" </p>-->
<!--                                            </a>-->
<!--                                </div>-->
<!--                            </div>-->

<!--                        </div>-->
                        <div class="card bg-base-100 w-5/6 shadow-xl pt-24 mx-auto mt-2.5">
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

                </div>
            </main>
        </div>
    <div class="min-[512px]:items-center min-[512px]:justify-center flex overflow-auto pb-24 h-screen ">
        <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div class="rounded-lg bg-card text-card-foreground shadow-sm " data-v0-t="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div class="rounded-lg border bg-card text-card-foreground pb-16 shadow-sm" data-v0-t="card">
                        <div class="p-6 flex flex-row items-center justify-between space-y-0 h-44" >
                            {#if user}
                                <h3 class="whitespace-nowrap tracking-tight text-5xl font-extrabold">Welcome {user.name}</h3>
                            {:else}
                                <h3 class="whitespace-nowrap tracking-tight text-5xl font-extrabold">Welcome guest</h3>
                            {/if}
                        </div>
                        <!--Greeting User-->
                        <div class="pl-6 font-medium">
                            So glad to see you again! Let's get started with your charging session.
                        </div>
                    </div>
                    <div class="rounded-lg border h-3/6 bg-card text-card-foreground overflow-auto shadow-sm pb-6" data-v0-t="card">
                        <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
                            <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Recent Charging History</h3>
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="w-4 h-4 text-base-200/30  dark:text-gray-400"
                            >
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                <path d="M3 3v5h5"></path>
                                <path d="M12 7v5l4 2"></path>
                            </svg>
                        </div>
                        <div class="p-6">
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center justify-between">
                                    <div class="font-medium">Port 2</div>
                                    <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                    <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="w-4 h-4"
                                        >
                                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                            <path d="M9 18h6"></path>
                                            <path d="M10 22h4"></path>
                                        </svg>
                                        35 kWh
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="font-medium">Port 6</div>
                                    <div class="text-gray-500 dark:text-gray-400">April 10, 2023</div>
                                    <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="w-4 h-4"
                                        >
                                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                            <path d="M9 18h6"></path>
                                            <path d="M10 22h4"></path>
                                        </svg>
                                        40 kWh
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="font-medium">Port 9</div>
                                    <div class="text-gray-500 dark:text-gray-400">April 5, 2023</div>
                                    <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="w-4 h-4"
                                        >
                                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                            <path d="M9 18h6"></path>
                                            <path d="M10 22h4"></path>
                                        </svg>
                                        50 kWh
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="font-medium">Port 2</div>
                                    <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                    <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="w-4 h-4"
                                        >
                                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                            <path d="M9 18h6"></path>
                                            <path d="M10 22h4"></path>
                                        </svg>
                                        35 kWh
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="font-medium">Port 2</div>
                                    <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                    <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="w-4 h-4"
                                        >
                                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                            <path d="M9 18h6"></path>
                                            <path d="M10 22h4"></path>
                                        </svg>
                                        35 kWh
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="font-medium">Port 2</div>
                                    <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                    <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="w-4 h-4"
                                        >
                                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                            <path d="M9 18h6"></path>
                                            <path d="M10 22h4"></path>
                                        </svg>
                                        35 kWh
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rounded-lg bg-card text-card-foreground shadow-sm" data-v0-t="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div class="rounded-lg border bg-card text-card-foreground overflow-auto shadow-sm" data-v0-t="card">
                        <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
                            <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Charging Requests</h3>
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="w-4 h-4 text-gray-500 dark:text-gray-400">
                                <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
                                <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
                                <path d="m11 7-3 5h4l-3 5"></path>
                                <line x1="22" x2="22" y1="11" y2="13"></line>
                            </svg>
                        </div>
                        <div class="p-6">
                            <div class="flex flex-col gap-2">
                                <a href="#" class="block max-w-2xl p-6 border bg-green-800 border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-green-800
                       dark:border-gray-700 dark:hover:bg-green-900">
                                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request : Urgent</h5>
                                    <p class="font-normal text-base-200/30  dark:text-gray-400">From : Bertha</p>
                                    <p class="font-normal text-base-200/30  dark:text-gray-400">For : Port 4 of Station Oostlaan</p>
                                    <p class="font-normal text-base-200/30  dark:text-gray-400">Reason : "Need it over 5 hours for full charge" </p>
                                </a>

                                <a href="#" class="block max-w-2xl p-6 bg-red-900 border border-gray-200
                                    rounded-lg shadow hover:bg-gray-100 dark:bg-red-800 dark:border-gray-700 dark:hover:bg-red-900">
                                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request</h5>
                                    <p class="font-normal text-base-200/30  dark:text-gray-400">From : Donald</p>
                                    <p class="font-normal text-base-200/30  dark:text-gray-400">For : Port 3 of Station Oostlaan</p>
                                    <p class="font-normal text-base-200/30  dark:text-gray-400">Reason : "Court case on 5" </p>
                                </a>
                            </div>
                        </div>

                    </div>
                    <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                        <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
                            <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Your Current Charging Session</h3>
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                            >
                                <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
                                <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
                                <path d="m11 7-3 5h4l-3 5"></path>
                                <line x1="22" x2="22" y1="11" y2="13"></line>
                            </svg>
                        </div>
                        {#if pageData.length > 0}
                            <div class="p-6">
                                {#each pageData as port}
                                    <div class="flex flex-col gap-2">
                                        <div class="flex items-center justify-between">

                                            <div class="font-medium">{port.displayName}</div>
                                            <div class="flex items-center gap-1 text-base-200/30  dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                45 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Estimated Time Remaining</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                30 mins
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Charging Status</div>
                                            <div class="flex items-center gap-1 text-green-500 dark:text-green-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg>
                                                Charging
                                            </div>
                                        </div>
                                        <button class="btn w-24 btn-error"
                                                on:click={() => disconnectPort(port.portId, port.stationId)}>Disconnect
                                        </button>
                                    </div>
                                {/each}
                            </div>

                        {:else}
                            <div class="p-6">
                                <div class="flex flex-col gap-2">
                                    <div class="flex items-center justify-between">
                                        <p>No current charging</p>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                    
                </div>

            </div>
        </main>
    </div>
{:else}
    <div>
        <div class="flex items-center justify-center h-screen">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="h-[500px] carousel carousel-vertical rounded-box">
                        <div class="carousel-item h-full">
                            <div class="rounded-lg border bg-card text-card-foreground pb-16 shadow-sm" data-v0-t="card">
                                <div class="p-6 flex flex-row items-center justify-between space-y-0 h-44" >
                                    {#if user}
                                        <h3 class="whitespace-nowrap tracking-tight text-5xl font-extrabold">Welcome {user.name}</h3>
                                    {:else}
                                        <h3 class="whitespace-nowrap tracking-tight text-5xl font-extrabold">Welcome guest</h3>
                                    {/if}
                                </div>
                                <div class="pl-6 font-medium">
                                    So glad to see you again! Let's get started with your charging session.
                                </div>
                            </div>
                        </div>
                        <div class="carousel-item h-full">
                            <div class="rounded-lg border h-3/6 bg-card text-card-foreground overflow-auto shadow-sm pb-6" data-v0-t="card">
                                <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
                                    <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Recent Charging History</h3>
                                    <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    >
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                        <path d="M3 3v5h5"></path>
                                        <path d="M12 7v5l4 2"></path>
                                    </svg>
                                </div>
                                <div class="p-6">
                                    <div class="flex flex-col gap-2">
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 2</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                35 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 6</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 10, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                40 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 9</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 5, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                50 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 2</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                35 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 2</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                35 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 2</div>
                                            <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                                            <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                35 kWh
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="carousel-item h-full">
                            <div class="rounded-lg border bg-card text-card-foreground overflow-auto shadow-sm" data-v0-t="card">
                                <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
                                    <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Charging Requests</h3>
                                    <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="w-4 h-4 text-gray-500 dark:text-gray-400">
                                        <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
                                        <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
                                        <path d="m11 7-3 5h4l-3 5"></path>
                                        <line x1="22" x2="22" y1="11" y2="13"></line>
                                    </svg>
                                </div>
                                <div class="p-6">
                                    <div class="flex flex-col gap-2">
                                        <a href="#" class="block max-w-2xl p-6 border bg-green-800 border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-green-800
                       dark:border-gray-700 dark:hover:bg-green-900">
                                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request : Urgent</h5>
                                            <p class="font-normal text-gray-700 dark:text-gray-400">From : Bertha</p>
                                            <p class="font-normal text-gray-700 dark:text-gray-400">For : Port 4 of Station Oostlaan</p>
                                            <p class="font-normal text-gray-700 dark:text-gray-400">Reason : "Need it over 5 hours for full charge" </p>
                                        </a>

                                        <a href="#" class="block max-w-2xl p-6 bg-red-900 border border-gray-200
                                    rounded-lg shadow hover:bg-gray-100 dark:bg-red-800 dark:border-gray-700 dark:hover:bg-red-900">
                                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request</h5>
                                            <p class="font-normal text-base-200/30  dark:text-gray-400">From : Donald</p>
                                            <p class="font-normal text-base-200/30  dark:text-gray-400">For : Port 3 of Station Oostlaan</p>
                                            <p class="font-normal text-base-200/30  dark:text-gray-400">Reason : "Court case on 5" </p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="carousel-item h-full">
                            <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                                <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
                                    <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Your Current Charging Session</h3>
                                    <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    >
                                        <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
                                        <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
                                        <path d="m11 7-3 5h4l-3 5"></path>
                                        <line x1="22" x2="22" y1="11" y2="13"></line>
                                    </svg>
                                </div>
                                <div class="p-6">
                                    <div class="flex flex-col gap-2">
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Port 4</div>
                                            <div class="flex items-center gap-1 text-base-200/30  dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                </svg>
                                                45 kWh
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Estimated Time Remaining</div>
                                            <div class="flex items-center gap-1 text-base-200/30 dark:text-gray-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                30 mins
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="font-medium">Charging Status</div>
                                            <div class="flex items-center gap-1 text-green-500 dark:text-green-400">
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="w-4 h-4"
                                                >
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg>
                                                Charging
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="carousel-item h-full">
                            <div class="card bg-base-100 w-5/6 shadow-xl pt-24 mx-auto mt-2.5">
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
                        <div class="carousel-item h-full">
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
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}