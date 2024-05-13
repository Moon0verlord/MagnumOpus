<script lang="ts">
    import {createEventDispatcher, onDestroy, onMount} from 'svelte';
    import {userId} from "../../../store.js";

export let show = false;
const dispatch = createEventDispatcher();

let currentPassword = '';
let newPassword = '';
let confirmPassword = '';
let errorMessage = '';
let currentUserId: string | null = null;
let unsubscribe: () => void;

async function checkCurrentPassword() {
    const response = await fetch('/api/checkPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { 
                currentPassword: currentPassword,
                userId: currentUserId
            })
    });

    const data = await response.json();

    if (response.ok) {
        await changePassword();
    } else {
        errorMessage = data.error;
    }
}

async function changePassword() {
    if (newPassword !== confirmPassword) {
        errorMessage = 'New password and confirmation do not match';
        return;
    }

    const response = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { 
                newPassword: newPassword,
                userId: currentUserId
            })
    });

    const data = await response.json();

    if (response.ok) {
        errorMessage = '';
        close();
    } else {
        errorMessage = data.error;
    }
}

    function close() {
        show = false;
        dispatch('close');
    }

    onMount(async () => {
        unsubscribe = userId.subscribe(value => {
            currentUserId = value;
        });
    });
    
    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });
</script>

{#if show}
    <div class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Change Password</h3>
            <div class="form-control">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">
                    <span class="label-text">Current Password</span>
                </label>
                <input type="password" class="input input-bordered" bind:value={currentPassword} />
            </div>
            <div class="form-control">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">
                    <span class="label-text">New Password</span>
                </label>
                <input type="password" class="input input-bordered" bind:value={newPassword} />
            </div>
            <div class="form-control">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">
                    <span class="label-text">Confirm New Password</span>
                </label>
                <input type="password" class="input input-bordered" bind:value={confirmPassword} />
            </div>
            {#if errorMessage}
                <div class="alert alert-error mt-4">
                    <span>{errorMessage}</span>
                </div>
            {/if}
            <div class="modal-action">
                <button class="btn btn-primary" on:click={checkCurrentPassword}>Change Password</button>
                <button class="btn" on:click={close}>Cancel</button>
            </div>
        </div>
    </div>
{/if}