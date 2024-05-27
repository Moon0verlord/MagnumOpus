<script lang="ts">
    import {createEventDispatcher} from "svelte";
    function incrementCharge(event: Event) {
        percentage_charge= Math.min(percentage_charge + 1, 100);
        console.log(percentage_charge);
    }
    function decrementCharge() {
        percentage_charge = Math.max(percentage_charge - 1, 0);
        console.log(percentage_charge);
    }
    function changeCharge(event: Event) {
        const value = parseInt((event.target as HTMLInputElement).value);
        percentage_charge = isNaN(value) ? percentage_charge : Math.min(Math.max(value, 0), 100);
        console.log(percentage_charge);
    }
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
    let percentage_charge = 0;
    async function requestPort() {
        console.log("Request port:"+typeof percentage_charge)
        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromUserId: user,
                priority: priority,
                requestedPortId: data.portId,
                message: description,
                percent: percentage_charge
            })
        });
        if (response.status === 201) {
            data = await response.json();
            console.log("Return data"+ data.percentage);
            close();
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
                    <form class="max-w-xs mx-auto">
                        <label for="quantity-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose battery percentage:</label>
                        <div class="grid grid-cols-3 ">
                            <button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" class="bg-gray-100 dark:bg-gray-700 
                            dark:hover:bg-gray-600 dark:border-gray-600 
                            hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 
                            focus:ring-2 focus:outline-none" on:click={decrementCharge}>
                                <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                                </svg>
                            </button>
                 
                            <input type="text" id="quantity-input" 
                                   data-input-counter aria-describedby="helper-text-explanation" 
                                   class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 
                                   focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                   dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   bind:value="{ percentage_charge }" placeholder="{percentage_charge}" required on:input={changeCharge}/> 
                            <button type="button" id="increment-button" data-input-counter-increment="quantity-input" 
                                      class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 
                                      hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 
                                      dark:focus:ring-gray-700 focus:ring-2 focus:outline-none" on:click={incrementCharge}>
                                
                                <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                                </svg>
                    
                            </button>
                      
                        </div>
                    </form>
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