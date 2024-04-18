<script lang="ts">
import {mobile} from '../mobile/mobile';

$: isMobile = $mobile;
</script>
<style>h1, h2, h3, h4, h5, h6 { font-family: 'Inter', sans-serif; --font-sans: 'Inter'; }
body { font-family: 'Inter', sans-serif; --font-sans: 'Inter'; }
</style>

<!--{#if !isMobile}-->
    
        <div class="flex items-center justify-center h-screen ">
            <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="rounded-lg  bg-card text-card-foreground shadow-sm " data-v0-t="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                            <div class="rounded-lg border bg-card text-card-foreground pb-16 shadow-sm" data-v0-t="card">
                                <div class="p-6 flex flex-row items-center justify-between space-y-0 h-44" >
                                    <h3 class="whitespace-nowrap tracking-tight text-5xl font-extrabold">Welcome User</h3>
                                </div>
                                <div class="pl-6 font-medium">
                                    So glad to see you again! Let's get started with your charging session.
                                </div>
                            </div>
                            <div class="rounded-lg border h-3/6 bg-card text-card-foreground overflow-auto shadow-sm pb-6" data-v0-t="card">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div class="rounded-lg bg-card text-card-foreground shadow-sm" data-v0-t="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                        <div class="rounded-lg border bg-card text-card-foreground overflow-auto shadow-sm" data-v0-t="card">
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
                                        class="w-4 h-4 text-gray-500 dark:text-gray-400">
                                    <path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
                                    <path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"></path>
                                    <path d="m11 7-3 5h4l-3 5"></path>
                                    <line x1="22" x2="22" y1="11" y2="13"></line>
                                </svg>
                            </div>
                            <div class="p-6">
                                <div class="flex flex-col gap-2">
                                    <a href="#" class="block max-w-2xl p-6 border bg-green-800 border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-green-800
                       dark:border-gray-700 dark:hover:bg-green-900">
                                                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request : Urgent</h5>
                                                <p class="font-normal text-gray-700 dark:text-gray-400">From : Bertha</p>
                                                <p class="font-normal text-gray-700 dark:text-gray-400">For : Port 4 of Station Oostlaan</p>
                                                <p class="font-normal text-gray-700 dark:text-gray-400">Reason : "Need it over 5 hours for full charge" </p>
                                            </a>
    
                                    <a href="#" class="block max-w-2xl p-6 bg-red-900 border border-gray-200 
                                    rounded-lg shadow hover:bg-gray-100 dark:bg-red-800 dark:border-gray-700 dark:hover:bg-red-900">
                                                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request</h5>
                                                <p class="font-normal text-gray-700 dark:text-gray-400">From : Donald</p>
                                                <p class="font-normal text-gray-700 dark:text-gray-400">For : Port 3 of Station Oostlaan</p>
                                                <p class="font-normal text-gray-700 dark:text-gray-400">Reason : "Court case on 5" </p>
                                            </a>
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
                    </div>
                    
                </div>
            </main>
        </div>
<!--    {:else}-->
<!--    <div>-->
<!--        <div class="flex items-center justify-center h-screen">-->
<!--            <div class="card bg-base-100 shadow-xl">-->
<!--                <div class="card-body">-->
<!--                    <h2 class="card-title">Coming Soon</h2>-->
<!--                    <progress class="progress w-56">-->
<!--                    </progress>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--{/if}-->