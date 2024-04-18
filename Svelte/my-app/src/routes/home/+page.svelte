<script lang="ts">
import {mobile} from '../mobile/mobile';

$: isMobile = $mobile;
</script>
<style>h1, h2, h3, h4, h5, h6 { font-family: 'Inter', sans-serif; --font-sans: 'Inter'; }
body { font-family: 'Inter', sans-serif; --font-sans: 'Inter'; }
</style>

<!--<div class="card bg-base-100 min-h-96  shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] card-body flex flex-col bg-base-300/80 check">-->
<!--    <p class="text-3xl font-bold">Current incoming Requests</p>-->
<!--    &lt;!&ndash;Request format&ndash;&gt;-->
<!--    <a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-red-800-->
<!--                    dark:border-gray-700 dark:hover:bg-red-900">-->
<!--        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request</h5>-->
<!--        <p class="font-normal text-gray-700 dark:text-gray-400">From : Donald</p>-->
<!--        <p class="font-normal text-gray-700 dark:text-gray-400">For : Port 5 of Station Oostlaan</p>-->
<!--        <p class="font-normal text-gray-700 dark:text-gray-400">Reason : "Court case on 5" </p>-->
<!--    </a>-->
<!--    <a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-green-800-->
<!--                    dark:border-gray-700 dark:hover:bg-green-900">-->
<!--        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request</h5>-->
<!--        <p class="font-normal text-gray-700 dark:text-gray-400">From : Bertha</p>-->
<!--        <p class="font-normal text-gray-700 dark:text-gray-400">For : Port 5 of Station Oostlaan</p>-->
<!--        <p class="font-normal text-gray-700 dark:text-gray-400">Reason : "Need it over 5 hours for full charge" </p>-->
<!--    </a>-->
<!--</div>-->

{#if !isMobile}
        <div class="flex mt-24 flex-col">
            
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

    {:else}
    <div>
        <div class="flex items-center justify-center h-screen">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Coming Soon</h2>
                    <progress class="progress w-56">
                    </progress>
                </div>
            </div>
        </div>
    </div>
{/if}