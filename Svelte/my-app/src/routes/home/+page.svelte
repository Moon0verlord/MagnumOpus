<script lang="ts">
import {mobile} from '../mobile/mobile';
import {onDestroy, onMount} from 'svelte';
import {userId} from "../../store";
import charge from "$lib/assets/SolarBatteryChargeBold.svg"
import lock from "$lib/assets/MaterialSymbolsLockOpenRight.svg"
import charger from "$lib/assets/MaterialSymbolsEvCharger.svg"
import logo from "$lib/assets/Schuberg.jpeg";
$: isMobile = $mobile;

let currentUserId: string | null;
let unsubscribe: () => void;

onMount(() => {
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



<style>h1, h2, h3, h4, h5, h6 { font-family: 'Inter', sans-serif; --font-sans: 'Inter'; }
body { font-family: 'Inter', sans-serif; --font-sans: 'Inter'; }
</style>

<div class="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
  <div class="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex h-[60px] items-center border-b px-6">
        <a class="flex items-center gap-2 font-semibold" href="#">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
          >
            <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
            <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
            <path d="m11 7-3 5h4l-3 5"></path>
            <line x1="22" x2="22" y1="11" y2="13"></line>
          </svg>
          <span class="">EV Charging</span>
        </a>
        <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground ml-auto h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          <span class="sr-only">Toggle notifications</span>
        </button>
      </div>
      <div class="flex-1 overflow-auto py-2">
        <nav class="grid items-start px-4 text-sm font-medium">
          <a
            class="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            href="#"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <rect width="7" height="9" x="3" y="3" rx="1"></rect>
              <rect width="7" height="5" x="14" y="3" rx="1"></rect>
              <rect width="7" height="9" x="14" y="12" rx="1"></rect>
              <rect width="7" height="5" x="3" y="16" rx="1"></rect>
            </svg>
            Dashboard
          </a>
          <a
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
              <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
              <path d="m11 7-3 5h4l-3 5"></path>
              <line x1="22" x2="22" y1="11" y2="13"></line>
            </svg>
            Charging Stations
          </a>
          <a
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
              <path d="M9 18h6"></path>
              <path d="M10 22h4"></path>
            </svg>
            Energy Usage
          </a>
          <a
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <rect width="20" height="14" x="2" y="5" rx="2"></rect>
              <line x1="2" x2="22" y1="10" y2="10"></line>
            </svg>
            Payments
          </a>
          <a
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Settings
          </a>
        </nav>
      </div>
      <div class="mt-auto p-4">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
          <div class="flex flex-col space-y-1.5 p-6 pb-4">
            <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Upgrade to Pro</h3>
            <p class="text-sm text-muted-foreground">
              Unlock all features and get unlimited access to our support team
            </p>
          </div>
          <div class="p-6">
            <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 w-full">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col">
    <header class="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <a class="lg:hidden" href="#">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-6 w-6"
        >
          <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
          <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
          <path d="m11 7-3 5h4l-3 5"></path>
          <line x1="22" x2="22" y1="11" y2="13"></line>
        </svg>
        <span class="sr-only">Home</span>
      </a>
      <div class="w-full flex-1">
        <h1 class="text-lg font-semibold">EV Charging Dashboard</h1>
      </div>
      <button
        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
        type="button"
        id="radix-:Rdlafnnja:"
        aria-haspopup="menu"
        aria-expanded="false"
        data-state="closed"
      >
        <img
          alt="Avatar"
          class="rounded-full"
          height="32"
          src="/placeholder.svg"
          style="aspect-ratio:32/32;object-fit:cover"
          width="32"
        />
        <span class="sr-only">Toggle user menu</span>
      </button>
    </header>
    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
          <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Charging Requests</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
            >
              <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
              <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
              <path d="m11 7-3 5h4l-3 5"></path>
              <line x1="22" x2="22" y1="11" y2="13"></line>
            </svg>
          </div>
          <div class="p-6">
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <div class="font-medium">John Doe</div>
                <div class="text-gray-500 dark:text-gray-400">Port 3</div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                  45 kWh
                </div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  30 mins
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="font-medium">Jane Smith</div>
                <div class="text-gray-500 dark:text-gray-400">Port 5</div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                  35 kWh
                </div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  45 mins
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="font-medium">Michael Johnson</div>
                <div class="text-gray-500 dark:text-gray-400">Port 7</div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                  55 kWh
                </div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  20 mins
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
          <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Your Current Charging Session</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
            >
              <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
              <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
              <path d="m11 7-3 5h4l-3 5"></path>
              <line x1="22" x2="22" y1="11" y2="13"></line>
            </svg>
          </div>
          <div class="p-6">
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <div class="font-medium">Port 4</div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                  45 kWh
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="font-medium">Estimated Time Remaining</div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  30 mins
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="font-medium">Charging Status</div>
                <div class="flex items-center gap-1 text-green-500 dark:text-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Charging
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
          <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Recent Charging History</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M12 7v5l4 2"></path>
            </svg>
          </div>
          <div class="p-6">
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <div class="font-medium">Port 2</div>
                <div class="text-gray-500 dark:text-gray-400">April 15, 2023</div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                  35 kWh
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="font-medium">Port 6</div>
                <div class="text-gray-500 dark:text-gray-400">April 10, 2023</div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                  40 kWh
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="font-medium">Port 9</div>
                <div class="text-gray-500 dark:text-gray-400">April 5, 2023</div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                  50 kWh
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
          <div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Available Charging Stations</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
            >
              <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
              <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
              <path d="m11 7-3 5h4l-3 5"></path>
              <line x1="22" x2="22" y1="11" y2="13"></line>
            </svg>
          </div>
          <div class="p-6">
            <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom text-sm">
                <thead class="[&amp;_tr]:border-b">
                  <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Station
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Ports
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Power
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="[&amp;_tr:last-child]:border-0">
                  <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">Station A</td>
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">1, 2, 3</td>
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-4 h-4"
                        >
                          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                          <path d="M9 18h6"></path>
                          <path d="M10 22h4"></path>
                        </svg>
                        50 kW
                      </div>
                    </td>
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <div class="flex items-center gap-2">
                        <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                          Start
                        </button>
                        <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">Station B</td>
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">4, 5, 6</td>
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-4 h-4"
                        >
                          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                          <path d="M9 18h6"></path>
                          <path d="M10 22h4"></path>
                        </svg>
                        75 kW
                      </div>
                    </td>
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <div class="flex items-center gap-2">
                        <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                          Start
                        </button>
                        <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">Station C</td>
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">7, 8, 9</td>
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-4 h-4"
                        >
                          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                          <path d="M9 18h6"></path>
                          <path d="M10 22h4"></path>
                        </svg>
                        100 kW
                      </div>
                    </td>
                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <div class="flex items-center gap-2">
                        <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                          Start
                        </button>
                        <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>