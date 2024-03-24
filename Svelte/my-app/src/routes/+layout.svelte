<script lang="ts">
    import "../app.css";
    import {page} from "$app/stores";
    import {theme} from '../routes/theme/theme';
    import {onMount} from 'svelte';

    let isMobile = false;

    onMount(() => {
        // Initial check
        isMobile = window.innerWidth < 768;

        // Listen for resize events
        window.addEventListener('resize', () => {
            isMobile = window.innerWidth < 768;
        });
    });

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

<html lang="en" class="bg outline-none">

<!-- Desktop Navbar -->
{#if !isMobile && ['/home', '/stations', '/settings', '/schuberg_api'].includes(currentPage)}
    <div class="navbar bg-base-100 fixed">
        <div class="flex-1">
            <a href="/home" class="btn btn-ghost text-xl">Schuberg Hub</a>
        </div>
        <div class="flex-none">
            <ul class="menu menu-horizontal px-1">
                <li><a href="/home">Home</a></li>
                <li><a href="/stations">Stations</a></li>
                <li><a href="/settings">Settings</a></li>
            </ul>
        </div>
    </div>
{/if}

<slot/>

<!-- Mobile Navbar -->
{#if isMobile && ['/home', '/stations', '/settings', '/schuberg_api'].includes(currentPage)}
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
    </div>
{/if}
</html>