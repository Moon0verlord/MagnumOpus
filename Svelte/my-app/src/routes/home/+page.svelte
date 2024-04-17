<script lang="ts">
import {mobile} from '../mobile/mobile';
import charge from "$lib/assets/SolarBatteryChargeBold.svg"
import lock from "$lib/assets/MaterialSymbolsLockOpenRight.svg"
import charger from "$lib/assets/MaterialSymbolsEvCharger.svg"
import logo from "$lib/assets/Schuberg.jpeg";
$: isMobile = $mobile;
</script>
<style>
    
    .stat {
        margin-top: -10px; /* Adjust the value to your preference */
    }
    
</style>

{#if !isMobile}
    <div>
        <div class="flex pl-16 items-center h-screen">
            <div class="h-4/6">
                <div class="card bg-base-100 pr-16 align-center justify-center shadow-xl card-body flex border-2 mb-5">
                    <p class="text-3xl font-bold">Currently used port</p>
                    <div class="flex float-left flex-col ">
                        <div class="stat gap-6">
                             <span class="flex text-align: left"> 
                                 <img class="h-12 w-10" src={charger} alt="charger">
                                 <span class="text-2xl">
                                     schedule request
                                 </span>
                             </span>
                            <span class="flex text-align: left;"> 
                                <img class="h-12 w-10" src={charge} alt="charge"> 
                                <span class="text-2xl">
                                    Charge status 
                                </span>
                            </span>
                            <span class="flex text-align: left;">
                                <img class="h-12 w-10" src={lock} alt="lock"> 
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
                            <div class="w-80 accent-gray-700 rounded-full dark:bg-gray-700">
                                <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 
                                                      leading-none rounded-full" style="width: 45%">45%</div>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="card bg-base-100 min-h-96 shadow-xl card-body flex flex-col border-2 check">
                    <p class="text-3xl font-bold">Current incoming Requests</p>
                    <p>No current requests</p>
                </div>
            </div>
            <div class="card card-body flex w-auto flex-col mx-12 bg-base-100 shadow-xl h-4/6 ml-4  border-2" >
                <h2 class="text-2xl font-bold mb-4">Information</h2>
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