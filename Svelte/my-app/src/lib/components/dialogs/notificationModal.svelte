<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";

    const dispatch = createEventDispatcher();
    export let showNotif = false;

    const close = () => {
        showNotif = false;
        dispatch("close");
    };

    const toggleNotifications = () => {
        if ("serviceWorker" in navigator) {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    console.log("Notification permission granted.");
                } else {
                    console.log("Unable to get permission to notify.");
                }
            });
        }
    };
</script>

{#if showNotif}
    <div
        class="fixed inset-0 flex items-center justify-center"
        transition:fly={{ duration: 200 }}
    >
        <div class="card w-80 glass lg:w-96">
            <div class="card-body">
                <h2 class="card-title">Notification</h2>
                <!-- <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text">Enable / Disable</span>
                        <button class="btn" on:click={toggleNotifications} />
                    </label>
                </div> -->
                LOL not yet implemented
                <div class="card-actions justify-end">
                    <button class="btn" on:click={close}>Close</button>
                </div>
            </div>
        </div>
    </div>
{/if}
