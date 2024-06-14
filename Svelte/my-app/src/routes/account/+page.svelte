<script lang="ts">
  
    import {mobile} from '../mobile/mobile';
    import {onDestroy, onMount} from 'svelte';
    import {userId} from "../../store";
    import oktaAuth from '../../oktaAuth';
    import type {AccessToken, IDToken, UserClaims,} from '@okta/okta-auth-js';
    import type {Port, User} from "$lib/server/db/types";
    import {getLevel, getMaxLevel} from "./page.account";
    
    let requestPageData: any[] = [];
    let incomingRequests: any[] = [];
    let allRequestData: any[] = [];
    let allOccupiedPorts: any[] = [];
    $: isMobile = $mobile;
    let curLevel:number | string;
    let maxLevel:number | string;
    let nextExp:number | string;
    let userInfo: UserClaims | null = null;
    let currentUserId: string | null = null;
    let currentUserIsAdmin: boolean | null = null;
    let currentUserInfo: User | null;
    
    let unsubscribe: () => void;
    let pageData: any[] = [];

    //Check updates 
    let UpdateCharge: boolean = false;
    let UpdateName: boolean = false;
    let UpdateEmail: boolean = false;
    async function UpdateUser(email: string | null, name: string | null) {
        const response = await fetch('/api/ChangeUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id : currentUserId,
                name: name,
                email: email
            })
        });
        if(response.ok)
        {
            if(email)
            {
                UpdateEmail = true;
            }
            if(name)
            {
                UpdateName = true;
            }
        }
        const data = await response.json();
        return data.user;
    }
    async function changeUserEmail(event: KeyboardEvent) {
        const inputElement = event.target as HTMLInputElement;
        const inputValue = inputElement.value;
        await UpdateUser(inputValue,null);
    }
    async function changeUserName(event: KeyboardEvent) {
        const inputElement = event.target as HTMLInputElement;
        const inputValue = inputElement.value;
        await UpdateUser(null,inputValue);
    }
    async function pushChargeData(carCharge: number) {
        try {
            console.log('Pushing data:', carCharge)
            const response = await fetch('/api/charge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: currentUserInfo ? currentUserInfo.userId : null,
                    charge: carCharge
                })
            });
            if (response.status !== 200) {
                console.error('Error pushing data, response not OK.');
            }
            else {
                UpdateCharge = true ;
            }
        } catch (error) {
            console.error('Error pushing data:', error);
        }
    }
    async function ChangeCharge(event: KeyboardEvent) {
        // Get the input element
        const inputElement = event.target as HTMLInputElement;

        // Get the current value as a number (handling non-numeric input)
        let inputValue = Number(inputElement.value);
        if (isNaN(inputValue)) {
            inputValue = 0; // Set to 0 if input is not a number
        }

        // Enforce valid range (0-100) using Math.min and Math.max
        inputValue = Math.min(Math.max(inputValue, 0), 100);

        // Update the input element's value
        inputElement.value = inputValue.toString();
        
        await pushChargeData(inputValue);
    }

    async function setLevel(user:User)
    {
        if (currentUserInfo) {
            let Level = await getLevel(user.totalXp);
            curLevel = Level;
            [maxLevel,nextExp] = await getMaxLevel(Level,user.totalXp)
            const response = await fetch('/api/getuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: currentUserInfo.email,
                    level: Level,
                    xp: user.totalXp
                })
            });
            if (response.ok) {
                const data = await response.json();
                return data.level;
            }
        }
        return null;
    }
    


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
        if (userInfo && userInfo.email) {
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

        if (userExists) {
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
        if (!currentUserId) {
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
        if (currentUserId !== null) {
            await getPorts();
            await myRequests();
            await getIncomingRequests();
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

        if (currentUserIsAdmin) {
            adminAllRequests();
            adminAllOccupiedPorts()
        }
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
        if (data.user) {
           await setLevel(data.user);
        }
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

    async function getPorts() {
        const response = await fetch(`/api/ports?id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            pageData = await response.json();
        }
    }

    async function myRequests() {
        const response = await fetch(`/api/requests?id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            requestPageData = await response.json();
        }
    }
    

    async function getIncomingRequests() {
        const response = await fetch(`/api/requests/incomingRequests?id=${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            incomingRequests = await response.json();

        }
    }
    async function adminAllRequests() {
        const response = await fetch(`/api/requests/allRequests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            allRequestData = await response.json();
        }
    }

    async function adminAllOccupiedPorts() {
        const response = await fetch(`/api/ports/allOccupiedPorts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            allOccupiedPorts = await response.json();
        }
    }
</script>

<div class="flex justify-center items-center h-screen mx-3">
    <div class="card bg-base-100 shadow-xl">
        <div class="w-full card-body">
            <div class="m-auto">
                <h1 class="card-title font-bold">Account</h1>

                {#if currentUserInfo }
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                        <span class="label-text">Name:</span>
                        {#if UpdateName}
                            <span class="label-text-alt text-green-500">Updated</span>
                        {:else}
                            <span class="label-text-alt">Enter to confirm</span>
                        {/if}
                        </div>
                        <input type="text" placeholder="{currentUserInfo.name}" class="input input-bordered w-full max-w-xs h-7" on:keydown={(e) => e.key === 'Enter' && changeUserName(e)} />
                    </label>
                    {#if currentUserInfo.oktaId===null}
                        <label class="form-control w-full max-w-xs">
                            <div class="label">
                            <span class="label-text">E-mail:</span>
                            {#if UpdateEmail}
                                <span class="label-text-alt text-green-500">Updated</span>
                            {:else}
                                <span class="label-text-alt">Enter to confirm</span>
                            {/if}
                            </div>
                            <input type="text" placeholder="{currentUserInfo.email}" class="input input-bordered w-full max-w-xs h-7" on:keydown={(e) => e.key === 'Enter' && changeUserEmail(e)} />
                        </label>
                    {/if}
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                        <span class="label-text">Battery percentage:</span>
                        {#if UpdateCharge}
                            <span class="label-text-alt text-green-500">Updated</span>
                        {:else}
                            <span class="label-text-alt">Enter to confirm</span>
                        {/if}
                        </div>
                        <input type="number" placeholder="{currentUserInfo.BatteryCurrent.toString()}" class="input input-bordered w-full max-w-xs h-7" min="1" max="100" on:keydown={(e) => e.key === 'Enter' && ChangeCharge(e)} />
                    </label>

                    <div class="mt-4">
                        <div style="display: flex; justify-content: space-between;">
                                    <span>
                                    Current Level : {curLevel}
                                    </span>
                                    <span class="text-right">
                                    Next Level : {maxLevel}
                                    </span>
                        </div>

                        <div class="flex items-center">
                            <div class="w-64 bg-gray-200 rounded-full dark:bg-gray-700">
                                {#if typeof maxLevel !== 'string' && typeof nextExp !== 'string'}
                                    {#if ((currentUserInfo.totalXp/nextExp)*100) <= 30 }
                                        <div class="bg-blue-600 text-xs font-light text-blue-100 text-center p-0.5 leading-none rounded-full" style="width: {(currentUserInfo.totalXp/nextExp)*100}%">{currentUserInfo.totalXp}</div>
                                        {:else}
                                        <div class="bg-blue-600 text-xs font-light text-blue-100 text-center p-0.5 leading-none rounded-full" style="width: {(currentUserInfo.totalXp/nextExp)*100}%"> XP : {currentUserInfo.totalXp}</div>
                                        {/if}
                                    {:else}
                                    <div></div>
                                {/if}
                            </div>
                            <span class="ml-2">XP: {nextExp}</span>
                        </div>
                    </div>
                {:else}
                    <div role="status">
                        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 
                            100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 
                            72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 
                            92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
                            4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 
                            1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 
                            44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928
                                12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121
                                86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
