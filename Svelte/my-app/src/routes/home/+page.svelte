<script lang="ts">
import {mobile} from '../mobile/mobile';
import {onDestroy, onMount} from 'svelte';
import {userId} from "../../store";
import charge from "$lib/assets/SolarBatteryChargeBold.svg"
import lock from "$lib/assets/MaterialSymbolsLockOpenRight.svg"
import charger from "$lib/assets/MaterialSymbolsEvCharger.svg"
import logo from "$lib/assets/Schuberg.jpeg";
import oktaAuth from '../../oktaAuth';
import type { OktaAuth, AccessToken, IDToken, UserClaims,} from '@okta/okta-auth-js';
import type {User} from "$lib/server/db/types";

$: isMobile = $mobile;
let userInfo: UserClaims | null = null;
let currentUserId: string | null = null;
let currentUserIsAdmin: boolean | null = null;
let currentUserInfo: User | null;
let unsubscribe: () => void;


async function getOktaUserInfo() {
  try {
    const accessToken = await oktaAuth.tokenManager.get('accessToken') as AccessToken;
    const idToken = await oktaAuth.tokenManager.get('idToken') as IDToken;
    userInfo = await oktaAuth.token.getUserInfo(accessToken, idToken);
  } catch (error) {
    console.error('Error getting user info:', error);
  }
}

async function CheckUserExists() {
  if (userInfo && userInfo.email)
  {
    const response = await fetch(`/api/home`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'email': (userInfo ? userInfo.email : '')
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.email === (userInfo ? userInfo.email : null)) {
        return true;
      } else {
        console.error('Email does not match');
        return false;
      }
    }
  }
}

async function PostOktaToDB() {
  let userExists = await CheckUserExists();

  if(userExists) {
    console.log('User already exists in DB');
    return;
  }

  if (userInfo) {
    const response = await fetch('/api/home', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: userInfo.name,
        email: userInfo.email,
        oktaId: userInfo.sub
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message); // "Success"
      console.log(data.uuid); // user's UUID
        userId.set(data.uuid);
    } else {
      console.error('Failed to post user to DB');
    }
  } else {
    console.error('User info is null');
  }
}

onMount(async () => {
    await getOktaUserInfo();
    await PostOktaToDB();
    unsubscribe = userId.subscribe(value => {
        currentUserId = value;
    });
    if (!currentUserId)
    {
        if (userInfo && userInfo.email) {
            const response = await fetch(`/api/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'email': (userInfo ? userInfo.email : '')
                },
            });
            if (response.ok) {
                const data = await response.json();
                userId.set(data.uuid);
            }
        }
    }
  });


onDestroy(() => {
    if (unsubscribe) {
        unsubscribe();
    }
});

$: if (currentUserId) {
    UserAdminCheck(currentUserId).then(isAdmin => currentUserIsAdmin = isAdmin);
    PopulateUser(currentUserId).then(user => currentUserInfo = user);
}

async function PopulateUser(id: string) {
    const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: id
        })
    });
    const data = await response.json();
    return data.user;
}

async function UserAdminCheck(id: string) {
    const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: id
        })
    });
    const data = await response.json();
    return data.isAdmin;
}
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
            <div class="flex pl-16 items-center justify-left h-screen">
                <div class="card bg-base-100 shadow-xl h-4/6">
                    <div class="card-body flex flex-col gap-6">
                        <span class="text-3xl"><b>Menu</b></span>
                        <span class="flex"> 
                        <img class="h-12 w-12" src={charger} alt="charge">
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
                            <div class="w-full accent-gray-700 rounded-full dark:bg-gray-700">
                                <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 
                                        leading-none rounded-full" style="width: 45%"> 45%</div>
                            </div>
                        </div>

                        <div class="button-container flex flex-wrap gap-4">
                            <p class="text-2xl font-bold gray-600">Sort charging list</p>
                            <button> All Stations </button>
                            <button> Available Now </button>
                            <button> 15-30 min wait </button>
                            <button> Fast Charger </button>
                            <button> Slow Charger </button>
                        </div>
                    </div>
                </div>
                <div class="flex mx-[30px] flex-col bg-base-100 shadow-xl h-4/6 ml-4 flex-grow">
                    <h2 class="text-2xl font-bold mb-4 p-3">User Name: {currentUserInfo?.name}<br>User ID: {currentUserId}<br>Is Admin?: {currentUserIsAdmin}</h2>
                    <p>List of available charging stations, their status, etc.</p>
                </div>
            </div>
        </div>
    {:else}
        <div>
            <div class="flex items-center justify-center h-screen">
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">Coming Soon</h2>
                        <progress class="progress w-56"></progress>
                    </div>
                </div>
            </div>
        </div>
    {/if}
