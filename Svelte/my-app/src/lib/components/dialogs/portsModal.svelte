<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();
    export let show = false;
    export let data: any;
    export let user: any;

    const close = () => {
        show = false;
        dispatch("close");
    }



    let description = '';
    let priority = '';

    async function requestPort() {
        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromUserId: user,
                priority: priority,
                requestedPortId: data.portId,
                message: description
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
                    userId: user,
                    portId: data.portId,
                    priority: priority,
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
    <div class="fixed inset-0 flex items-center justify-center">
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
                                    <input type="radio" name="radio-10" bind:group={priority} value="high"  class="radio checked:bg-red-500"/>
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