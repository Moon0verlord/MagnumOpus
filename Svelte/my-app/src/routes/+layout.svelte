<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";
    import { theme } from '../routes/theme/theme';

    if (typeof window !== 'undefined') {
        const localTheme = localStorage.getItem('theme');
        if (localTheme) {
            theme.set(localTheme); // Update the theme store
        }
    }

    let currentPage: string;
    $: currentPage = $page.url.pathname;

    // Subscribe to the theme store
    theme.subscribe(value => {
        if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', value); // Update the data-theme attribute
        }
    });

    function navigateTo(url: string) {
        if (typeof window !== 'undefined') {
            window.location.href = url;
        }
    }

    // Add a storage event listener
    if (typeof window !== 'undefined') {
        window.addEventListener('storage', (event) => {
            if (event.key === 'theme') {
                theme.set(localStorage.getItem('theme') || 'light'); // Update the theme store
            }
        });
    }
</script>

<svelte:head>
    <script>
        if (typeof window !== 'undefined') {
            const theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        }
    </script>
</svelte:head>

<html lang="en" class="bg">
<slot/>

<!-- Menu -->
{#if ['/home', '/stations', '/settings', '/schuberg_api'].includes(currentPage)}
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
</html>