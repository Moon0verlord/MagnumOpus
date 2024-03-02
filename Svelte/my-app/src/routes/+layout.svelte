<script lang="ts">
    import "../app.css";

    import { page } from "$app/stores";

    let currentPage: string;
    $: currentPage = $page.url.pathname;
</script>

<slot />

{#if currentPage !== '/'}
    <!-- Menu -->
    <div class="btm-nav">
        <button class="{currentPage === '/home' ? 'active' : ''}">
            <a href="/home">
                <span class="btm-nav-label">Home</span>
            </a>
        </button>
        <button class="{currentPage === '/stations' ? 'active' : ''}">
            <a href="/stations">
                <span class="btm-nav-label">Stations</span>
            </a>
        </button>
        <button class="{currentPage === '/profile' ? 'active' : ''}">
            <a href="/profile">
                <span class="btm-nav-label">Profile</span>
            </a>
        </button>
    </div>
{/if}