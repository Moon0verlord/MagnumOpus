<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";

    let currentPage: string;
    $: currentPage = $page.url.pathname;

    function navigateTo(url: string) {
        if (typeof window !== 'undefined') {
            window.location.href = url;
        }
    }
</script>

<div>
    <slot/>
</div>

<!-- Menu -->
{#if currentPage !== '/' && currentPage !== '/register'}
    <div class="btm-nav">
        <button class:active={currentPage === '/home'} on:click={() => navigateTo('/home')}>
            <span class="btm-nav-label">Home</span>
        </button>
        <button class:active={currentPage === '/stations'} on:click={() => navigateTo('/stations')}>
            <span class="btm-nav-label">Stations</span>
        </button>
        <button class:active={currentPage === '/settings'} on:click={() => navigateTo('/settings')}>
            <span class="btm-nav-label">Settings</span>
        </button>
        <button class:active={currentPage === '/schuberg_api'} on:click={() => navigateTo('/schuberg_api')}>
            <span class="btm-nav-label">API</span>
        </button>
    </div>
{/if}