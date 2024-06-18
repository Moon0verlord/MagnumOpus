<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";
    import { theme } from "./theme/theme";
    import { mobile } from "./mobile/mobile";
    import { onMount, onDestroy } from "svelte";

    export let isMobile = false;

    onMount(() => {
        // Initial check
        isMobile = window.innerWidth < 768;
        mobile.set(isMobile);

        // Listen for resize events
        window.addEventListener("resize", () => {
            isMobile = window.innerWidth < 768;
            mobile.set(isMobile);
        });
    });

    if (typeof window !== "undefined") {
        const localTheme = localStorage.getItem("theme");
        if (localTheme) {
            theme.set(localTheme); // Update the theme store
        }
    }

    let currentPage: string;
    $: currentPage = $page.url.pathname;

    // Subscribe to the theme store
    theme.subscribe((value) => {
        if (typeof window !== "undefined") {
            document.documentElement.setAttribute("data-theme", value); // Update the data-theme attribute
        }
    });

    const unsubscribe = mobile.subscribe((value) => {
        isMobile = value;
    });

    // Add a storage event listener
    if (typeof window !== "undefined") {
        window.addEventListener("storage", (event) => {
            if (event.key === "theme") {
                theme.set(localStorage.getItem("theme") || "light"); // Update the theme store
            }
        });
    }

    const unsubscribeTheme = theme.subscribe((value) => {
        if (typeof window !== "undefined") {
            document.documentElement.setAttribute("data-theme", value); // Update the data-theme attribute
        }
    });

    onDestroy(() => {
        unsubscribe();
        unsubscribeTheme();
    });
</script>

<svelte:head>
    <script>
        if (typeof window !== "undefined") {
            const theme = localStorage.getItem("theme") || "light";
            document.documentElement.setAttribute("data-theme", theme);
        }
    </script>
</svelte:head>

<html lang="en" class="bg outline-none">
    <!-- Desktop Navbar -->

    {#if !isMobile && ["/home", "/stations", "/settings", "/account"].includes(currentPage)}
        <div class="navbar bg-base-100 h-24">
            <div class="flex-1 items-center h-20">
                <a href="/home" class="btn btn-ghost text-xl px-2">
                    <img
                        src="/assets/logo.svg"
                        alt="Logo"
                        class="w-6 h-6 mr-"
                    />
                    Schuberg Hub
                </a>
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

    <div
        class={isMobile
            ? currentPage === "/" || currentPage === "/register"
                ? ""
                : "-mb-16"
            : currentPage === "/" || currentPage === "/register"
              ? ""
              : "-mt-24"}
    >
        <slot />
    </div>

    <!-- Mobile Navbar -->
    {#if isMobile && ["/home", "/stations", "/settings", "/account"].includes(currentPage)}
        <div class="btm-nav pb-6">
            <a href="/home" class:active={currentPage === "/home"}>
                <button>
                    <span class="btm-nav-label">Home</span>
                </button>
            </a>
            <a href="/stations" class:active={currentPage === "/stations"}>
                <button>
                    <span class="btm-nav-label">Stations</span>
                </button>
            </a>
            <a href="/settings" class:active={currentPage === "/settings"}>
                <button>
                    <span class="btm-nav-label">Settings</span>
                </button>
            </a>
        </div>
    {/if}
</html>
