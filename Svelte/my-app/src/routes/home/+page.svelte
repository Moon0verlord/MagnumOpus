<script lang="ts">
import {mobile} from '../mobile/mobile';
import charge from "$lib/assets/SolarBatteryChargeBold.svg"
import lock from "$lib/assets/MaterialSymbolsLockOpenRight.svg"
import charger from "$lib/assets/MaterialSymbolsEvCharger.svg"
import logo from "$lib/assets/Schuberg.jpeg";
$: isMobile = $mobile;
</script>
<style>
    .card-body{
        width: 350px;
        
    }
    .button-container button{
        background-color: lightgrey;
        border-radius: 10px;
        width: 300px;
        height: 50px;
    }
    
</style>

{#if !isMobile}
    <div>
        <div class="flex pl-16 items-center  h-screen">
            <div class="card h-4/6">
                <div class="card align-center m-0 pl-0 bg-base-100 shadow-xl h-4/6 card-body flex  gap-12 border-2">
                    <span class="text-3xl"><b>Currently used Port</b></span>
                    <div class="card-body flex flex-col gap-6">
                        <span class="flex"> 
                                <img class="h-12 w-10" src={charger} alt="charge">
                                 <span class="text-2xl">
                                    schedule request
                                </span>
                              </span>
                        <span class="flex"> 
                                <img class="h-12 w-12" src={charge} alt="charge"> 
                                   <span class="text-2xl">
                                    Charge status 
                                </span>
                              </span>
                        <span class="flex"> 
                                <img class="h-12 w-12" src={lock} alt="charge"> 
                                <span class="text-2xl">
                                    Unlock connector 
                                </span>
                              </span>
                        <div>
                            <p class="text-2xl font-bold gray-600">Charging</p>
                            <span class="flex">
                                Charging 
                                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                      viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-1.875 0-3.512-.712t-2.85-1.925t-1.925-2.85T3 
                                 13t.713-3.512t1.924-2.85t2.85-1.925T12 
                                 4t3.513.713t2.85 1.925t1.925 2.85T21 13t-.712 3.513t-1.925 2.85t-2.85 1.925T12 22m2.8-4.8l1.4-1.4l-3.2-3.2V8h-2v5.4zM5.6 2.35L7 3.75L2.75 
                                 8l-1.4-1.4zm12.8 0l4.25 4.25l-1.4 1.4L17 3.75z"/></svg> Remaining time 44:03
                            </span>
                            <div class="w-full accent-gray-700 rounded-full dark:bg-gray-700">
                                <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 
                                                      leading-none rounded-full" style="width: 45%">45%</div>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="card bg-base-100 pr-16 shadow-xl h-4/6 card-body flex flex-col gap-12 border-2 check">
                    <span class="text-3xl"><b>Current incoming Requests</b></span>
                </div>
            </div>
            <div class="card flex w-5/6 flex-col bg-base-100 shadow-xl h-4/6 ml-4 gap-12  border-2" >
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