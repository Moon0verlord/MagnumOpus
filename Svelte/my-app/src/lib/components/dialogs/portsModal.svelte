<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();
    export let show = false;
    export let data: any;
    const close = () => {
        show = false;
        dispatch("close");
    }
</script>

{#if show}
    <div class="fixed inset-0 flex items-center justify-center">
        <div class="card w-80 glass bg-base-100 lg:w-96">
            <div class="card-body">
                <h2 class="card-title">{data.displayName}</h2>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6">Status</dt>
                    <dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                        {data.status}
                    </dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6">Priority</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Urgent</span>
                                <input type="radio" name="radio-10" class="radio checked:bg-red-500"/>
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Medium Priority</span>
                                <input type="radio" name="radio-10" class="radio checked:bg-orange-500"/>
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Low Priority</span>
                                <input type="radio" name="radio-10" class="radio checked:bg-green-500"/>
                            </label>
                        </div>
                    </dd>
                </div>
                <div class="flex justify-between">
                    <div class="flex justify-center w-full">
                        <button class="btn btn-info w-60">Request</button>
                    </div>
                    <div class="card-actions justify-end w-full">
                        <button class="btn" on:click={close}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}