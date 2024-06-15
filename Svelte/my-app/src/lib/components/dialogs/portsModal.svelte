<script lang="ts">
    import {createEventDispatcher, onDestroy, onMount} from "svelte";
    import {isNumber, type UserClaims} from "@okta/okta-auth-js";
    import {userId} from "../../../store";
    import type {User} from "$lib/server/db/types";
    import {mobile} from "../../../routes/mobile/mobile";

    const dispatch = createEventDispatcher();
    let user: User;
    $: isMobile = $mobile;
    let userInfo: UserClaims | null = null;
    let currentUserId: string | null = null;
    let unsubscribe: () => void;
    export let show = false;
    export let data: any;
    let percentage = 0;

    const close = () => {
        show = false;
        dispatch("close");
    }

    onMount(async () => {
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
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    async function getCharge() {
        if (currentUserId) {
            const response = await fetch(`/api/requests/charge`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'id': (currentUserId ? currentUserId : '')
                },
            });
            let data = await response.json();
            percentage = data.charge;
        } else {
            console.log("User not found");

        }
    }

    let description = '';
    let priority = '';

    async function requestPort() {
        await getCharge();
        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: currentUserId,
                priority: priority,
                requestedPortId: data.portId,
                message: description,
                percent: percentage
            })
        });


        if (response.status === 201) {
            close();
            const responseSlack = await fetch('/api/slack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Port Request',
                    userId: currentUserId,
                    portId: data.portId,
                    priority: priority,
                    description: description,
                }),
            });
        } else if (response.status === 202) {
            console.log('Port is already requested');
            close();
        } else {
            console.log('Internal Server Error');
        }
    }
</script>

{#if show}
    <div class="fixed inset-1 z-40 flex items-center justify-center">
        <div class="card w-96 glass bg-base-100">
            <div class="card-body">
                <h2 class="card-title">{data.displayName}</h2>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6">Status</dt>
                    <dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                        <div class="badge p-3 {data.status === 'available' ? 'badge-success' : data.status === 'occupied' ? 'badge-error' : 'badge-ghost'}">
                            {data.status}
                        </div>
                    </dd>
                </div>
                <div class="pb-6 grid grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="flex-grow">
                            <textarea class="textarea textarea-bordered h-40 resize-none"
                                      bind:value={description} placeholder="Description"></textarea>
                        </div>
                        <div class="flex-grow pl-2">
                            <div class="form-control">
                                <label class="label cursor-pointer">
                                    <span class="label-text pr-5">Urgent</span>
                                    <input type="radio" name="radio-10" bind:group={priority} value="high" class="radio checked:bg-red-500"/>
                                </label>
                            </div>
                            <div class="form-control">
                                <label class="label cursor-pointer">
                                    <span class="label-text">Medium Priority</span>
                                    <input type="radio" name="radio-10" bind:group={priority} value="medium" class="radio checked:bg-orange-500"/>
                                </label>
                            </div>
                            <div class="form-control">
                                <label class="label cursor-pointer">
                                    <span class="label-text">Low Priority</span>
                                    <input type="radio" name="radio-10" bind:group={priority} value="low" class="radio checked:bg-green-500"/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-between">
                    <div class="flex justify-center w-full">
                        <button class="btn btn-info w-60" on:click={() => requestPort()}>Request</button>
                    </div>
                    <div class="card-actions justify-end w-full">
                        <button class="btn" on:click={close}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}