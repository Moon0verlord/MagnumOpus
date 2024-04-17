<script lang="ts">
import {mobile} from '../mobile/mobile';

$: isMobile = $mobile;
</script>
<style>
    
    .stat {
        margin-top: -10px; /* Adjust the value to your preference */
    }
    .test{
        background-color: white;
    }
    
</style>

{#if !isMobile}
    <div>
        <div class="flex pl-16 items-center h-screen">
            <div class="h-4/6">
                <div class="card bg-base-100 pr-16 align-center justify-center shadow-xl card-body flex bg-base-300/80 mb-5">
                    <p class="text-3xl font-bold">Currently used port</p>
                    <div class="flex float-left flex-col ">
                        <div class="stat gap-6">
                             <span class="flex text-align: left"> 
                                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" 
                                      viewBox="0 0 24 24"><path fill="currentColor" d="M6 10h6V5H6zM4 
                                 21V3h10v9h3v7.5h2.25V9H18V6h.5V4.5h1V6h1V4.5h1V6h.5v3h-1.25v12H15.5v-7.5H14V21zm4.5-2l2.5-4H9.5v-3L7 
                                 16h1.5z"/></svg>
                                 <span class="text-2xl">
                                     schedule request
                                 </span>
                             </span>
                            <span class="flex text-align: left;"> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" 
                                     viewBox="0 0 24 24"><path fill="currentColor" d="M12 11V5l-5 8h3v6l5-8zM3 5h16a1 
                                1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1m18 4h2v6h-2z"/></svg>
                                <span class="text-2xl">
                                    Charge status 
                                </span>
                            </span>
                            <span class="flex text-align: left;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" 
                                     viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q.825 0 1.413-.587T14 
                                15t-.587-1.412T12 13t-1.412.588T10 15t.588 1.413T12 17m-8 5V8h9V6q0-2.075 1.463-3.537T18 1t3.538 1.463T23 6h-2q0-1.25-.875-2.125T18 
                                3t-2.125.875T15 6v2h5v14z"/></svg>
                                <span class="text-2xl ">
                                    Unlock connector 
                                </span>
                            </span>
                        </div>
                        <div class = "stat">
                            <span class="flex">
                                <p class="space-x-100 font-bold text-xl">Charging </p>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                      viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-1.875 0-3.512-.712t-2.85-1.925t-1.925-2.85T3 
                                 13t.713-3.512t1.924-2.85t2.85-1.925T12 
                                 4t3.513.713t2.85 1.925t1.925 2.85T21 13t-.712 3.513t-1.925 2.85t-2.85 1.925T12 22m2.8-4.8l1.4-1.4l-3.2-3.2V8h-2v5.4zM5.6 2.35L7 3.75L2.75 
                                 8l-1.4-1.4zm12.8 0l4.25 4.25l-1.4 1.4L17 3.75z"/></svg> Remaining time 44:03
                            </span>
                            <div class="w-80 accent-gray-700 rounded-full dark:bg-gray-700 ">
                                <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 
                                                      leading-none rounded-full shadow-lg shadow-blue-500" style="width: 90%">90%</div>
                            </div>
                        </div>
                    </div>
                </div>
           
                <div class="card bg-base-100 min-h-96  shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] card-body flex flex-col bg-base-300/80 check">
                    <p class="text-3xl font-bold">Current incoming Requests</p>
                    <!--Request format-->
                    <a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-red-800
                    dark:border-gray-700 dark:hover:bg-red-900">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400">From : Donald</p>
                        <p class="font-normal text-gray-700 dark:text-gray-400">For : Port 5 of Station Oostlaan</p>
                        <p class="font-normal text-gray-700 dark:text-gray-400">Reason : "Court case on 5" </p>
                    </a>
                    <a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-green-800
                    dark:border-gray-700 dark:hover:bg-green-900">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Request</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400">From : Bertha</p>
                        <p class="font-normal text-gray-700 dark:text-gray-400">For : Port 5 of Station Oostlaan</p>
                        <p class="font-normal text-gray-700 dark:text-gray-400">Reason : "Need it over 5 hours for full charge" </p>
                    </a>
                </div>
            </div>
            <div class="card card-body flex w-auto flex-col mx-12 bg-base-100 shadow-xl bg-base-300/80 h-4/6 ml-4  " >
                <p class="text-3xl font-bold">Information</p>
            </div>
        </div>
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