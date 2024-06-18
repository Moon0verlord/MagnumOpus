<script lang="ts">
    import { mobile } from "../mobile/mobile";
    import { onDestroy, onMount } from "svelte";
    import { userId } from "../../store";
    import oktaAuth from "../../oktaAuth";
    import {
        type AccessToken,
        type IDToken,
        type UserClaims,
    } from "@okta/okta-auth-js";
    import type { CarData, Port, User } from "$lib/server/db/types";
    import type { PageData } from "./$types";
    import { beforeNavigate } from "$app/navigation";

    export let data: PageData;
    let requestPageData: any[] = data && data.props && data.props.requests ? data.props.requests : [];
    let incomingRequests: any[] = data && data.props && data.props.incoming ? data.props.incoming : [];
    let allRequestData: any[] = data && data.props && data.props.requestsAll ? data.props.requestsAll : [];
    let allOccupiedPorts: any[] = data && data.props && data.props.usedPorts ? data.props.usedPorts : [];
    let portsData: any[] = data && data.props && data.props.ports ? data.props.ports : [];

    //Car selection variables
    let cars: Record<string, CarData[]> = data && data.props && data.props.cars ? data.props.cars : [];
    let keys: string[] = Object.keys(cars);
    let CarOfChoice: string;

    let isMobile: boolean;
    $: isMobile = $mobile;
    let userInfo: UserClaims | null = null;
    let currentUserId: string | null = data.props.userId;
    let currentUserIsAdmin: boolean | null = data.props.admin
        ? data.props.admin
        : null;
    $: currentUserInfo = data.props.user ? data.props.user : null;
    let unsubscribe: () => void;
    let pageData: any[] = [];
    let percentage_charge = 0;
    let carIntervalId: any;
    let carCharge: number;
    $: carCharge = currentUserInfo ? Number(currentUserInfo.BatteryCurrent) : 0;

    beforeNavigate(async (navigation) => {
        if (
            navigation.type === "leave" ||
            (navigation.type === "link" &&
                navigation.to != null &&
                navigation.to.route)
        ) {
            await pushChargeData();
        }
    });

    // Double onMount, first is NOT ASYNCHRONOUS to handle browser unloads such as closing tab.
    onMount(() => {
        window.addEventListener("beforeunload", pushChargeDataBeacon);
        return () => {
            window.removeEventListener("beforeunload", pushChargeDataBeacon);
        };
    });

    function pushChargeDataBeacon(event: any) {
        try {
            const data = JSON.stringify({
                userId: currentUserInfo ? currentUserInfo.userId : null,
                charge: carCharge,
            });
            navigator.sendBeacon("/api/charge", data);
        } catch (error) {
            console.error("Error pushing data:", error);
        }
    }

    async function pushChargeData() {
        try {
            const response = await fetch("/api/charge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: currentUserInfo ? currentUserInfo.userId : null,
                    charge: carCharge,
                }),
            });
            if (response.status !== 200) {
                console.error("Error pushing data, response not OK.");
            } else {
                console.log("Data pushed successfully");
            }
        } catch (error) {
            console.error("Error pushing data:", error);
        }
    }

    onMount(async () => {
        let result = document.cookie
            .split("; ")
            .find((row: string) => row.startsWith("userId="))
            ?.split("=")[1];

        let uuidv4Regex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (
            result == "Expired" ||
            result == undefined ||
            !uuidv4Regex.test(result)
        ) {
            await getOktaUserInfo();
            await PostOktaToDB();
            unsubscribe = userId.subscribe((value) => {
                currentUserId = value;
            });
            if (!currentUserId) {
                if (userInfo && userInfo.email) {
                    const response = await fetch(`/api/user`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            email: userInfo ? userInfo.email : "",
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        document.cookie = `userId=${data.uuid}; SameSite=None; path=/; Secure`;
                        userId.set(data.uuid);
                    }
                }
            }
            if (currentUserId !== null) {
                await PopulateUser(currentUserId).then((user) => {
                    currentUserInfo = user;
                    currentUserIsAdmin = user.isAdmin;
                });

                if (currentUserIsAdmin) {
                    await adminAllRequests();
                    await adminAllOccupiedPorts();
                } else {
                    await getPorts();
                    await myRequests();
                    await getIncomingRequests();
                }
            }
        } else {
            await getOktaUserInfo();
            await PostOktaToDB();
            if (result !== "Expired" || result !== undefined) {
                await PopulateUser(result).then((user) => {
                    currentUserInfo = user;
                    currentUserId = user.userId;
                    currentUserIsAdmin = user.isAdmin;
                });
            }

            if (currentUserIsAdmin) {
                await adminAllRequests();
                await adminAllOccupiedPorts();
            } else {
                await getPorts();
                await myRequests();
                await getIncomingRequests();
            }
        }

        if (currentUserInfo) {
            if (!currentUserInfo.carModel) {
                showNotification();
            }
        }

        carIntervalId = setInterval(async () => {
            try{
            if (currentUserInfo && currentUserInfo.BatteryCurrent && portsData.length > 0) {
                const port = portsData[0];
                    if(port.maxPower) 
                    {
                        const date = new Date();
                        const millis = date.getTime();
                        const lastCharge = currentUserInfo.lastChargeTime;
                        if (lastCharge !== null && lastCharge !== undefined && currentUserInfo.BatteryMax) {
                            const timeAway = Math.floor((millis - parseFloat(lastCharge)) / 1000);
                            const chargeRate = parseFloat(currentUserInfo.BatteryMax) / port.maxPower;
                            
                            const charge = Math.min(100, Number(currentUserInfo.BatteryCurrent) + Math.floor(timeAway / chargeRate));
                            if(carCharge < 100){
                                carCharge = charge;
                            }
                            else if (charge >= 100){
                                carCharge = 100;
                            }
                        }
                    }
            }
            } catch (error) {
                console.error("Error calculating charge:", error);
                
            }
        }, 4000);

        if (currentUserId) {
            document.cookie = `userId=${currentUserId}; SameSite=None; path=/; Secure`;
        }
    });

    onDestroy(() => {
        clearInterval(carIntervalId);
    });

    async function sendNotification() {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            showNotification();
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    showNotification();
                }
            });
        }
    }

    function showNotification() {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification(
                    `Hello ${currentUserInfo!.name}!`,
                    {
                        body: "Welcome to Schuberg Hub",
                        icon: "/assets/favicon.ico",
                        tag: "Greeting",
                    },
                );
            });
        }
    }

    async function roundToTwoDecimals(number: number) {
        return parseFloat(number.toFixed(2));
    }

    function navigateToSlide(slideIndex: number) {
        const carousel = document.querySelector(".carousel");
        if (carousel) {
            carousel.scrollTo({
                // @ts-ignore
                left: (slideIndex - 1) * carousel.offsetWidth,
                behavior: "smooth",
            });
        }
    }

    async function ChooseCar(event: Event) {
        CarOfChoice = (event.target as HTMLSelectElement).value;
    }

    async function DoneChoosingCar() {
        if (CarOfChoice && currentUserId) {
            let charge = await roundToTwoDecimals(percentage_charge);
            const response = await fetch("/api/cars", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    car: CarOfChoice,
                    userId: currentUserId,
                    batteryCurrent: charge,
                }),
            });
            console.log(response);
            if (response.ok) {
                console.log("POPULATING USER WITH NEW CAR!");
                await PopulateUser(currentUserId).then((user) => {
                    currentUserInfo = user;
                });
            }
        }
    }

    async function getOktaUserInfo() {
        try {
            const accessToken = (await oktaAuth.tokenManager.get(
                "accessToken",
            )) as AccessToken;
            const idToken = (await oktaAuth.tokenManager.get(
                "idToken",
            )) as IDToken;
            userInfo = await oktaAuth.token.getUserInfo(accessToken, idToken);
        } catch (error) {
            console.error("Error getting user info:", error);
        }
    }

    async function CheckUserExists() {
        if (userInfo && userInfo.email) {
            const response = await fetch(`/api/home`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    email: userInfo ? userInfo.email : "",
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.email === (userInfo ? userInfo.email : null)) {
                    return true;
                } else {
                    console.error("Email does not match");
                    return false;
                }
            }
        }
    }

    async function PostOktaToDB() {
        let userExists = await CheckUserExists();

        if (userExists) {
            console.log("User already exists in DB");
            return;
        }

        if (userInfo) {
            const response = await fetch("/api/home", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                    oktaId: userInfo.sub,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // "Success"
                console.log(data.uuid); // user's UUID
                document.cookie = `userId=${data.uuid}; SameSite=None; path=/; Secure`;
                userId.set(data.uuid);
            }
        }
    }

    async function PopulateUser(id: string) {
        const response = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: id,
            }),
        });
        const data = await response.json();
        let user = data.user
        if (user?.lastChargeTime !== null && portsData.length >= 1)
        {
            // User has port, so new charge must be calculated based on time away.
            let millis = Date.now() - Number(user?.lastChargeTime)
            const intervals = Math.floor(millis / 4000);
            // Calculate how many 4 second intervals there were, and increase charge by that amount (obviously test numbers and not real but you know)
            data.user.BatteryCurrent = Math.min(100, Number(user.BatteryCurrent) + intervals).toString()
        }

        return user;
    }

    async function UserAdminCheck(id: string) {
        const response = await fetch("/api/admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: id,
            }),
        });
        const data = await response.json();
        return data.isAdmin;
    }

    async function getPorts() {
        const response = await fetch(`/api/ports?id=${currentUserId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 201) {
            portsData = await response.json();
        }
    }

    async function myRequests() {
        const response = await fetch(`/api/requests?id=${currentUserId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 201) {
            requestPageData = await response.json();
        }
    }

    async function getIncomingRequests() {
        const response = await fetch(
            `/api/requests/incomingRequests?id=${currentUserId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (response.status === 201) {
            incomingRequests = await response.json();
        }
    }

    async function adminAllRequests() {
        const response = await fetch(`/api/requests/allRequests`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 201) {
            allRequestData = await response.json();
        }
    }

    async function adminAllOccupiedPorts() {
        const response = await fetch(`/api/ports/allOccupiedPorts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 201) {
            allOccupiedPorts = await response.json();
        }
    }

    async function disconnectPort(portId: string, stationId: string) {
        const response = await fetch("/api/ports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                portId: portId,
                stationId: stationId,
            }),
        });

        if (response.status === 201) {
            const data = await response.json();
            console.log(data);
            portsData = portsData.filter((port) => port.portId !== portId);
            allOccupiedPorts = allOccupiedPorts.filter(
                (port) => port.portId !== portId,
            );
        }
    }

    async function cancelRequest(requestId: number) {
        const response = await fetch("/api/requests/cancelRequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                requestId: requestId,
            }),
        });

        if (response.status === 201) {
            const data = await response.json();
            console.log(data);
            requestPageData = requestPageData.filter(
                (request) => request.requestId !== requestId,
            );
            allRequestData = allRequestData.filter(
                (request) => request.requestId !== requestId,
            );
        }
    }

    async function approveRequest(fromUserId: string, requestedPortId: number) {
        const response = await fetch("/api/requests/acceptRequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fromUserId: fromUserId,
                requestedPortId: requestedPortId,
            }),
        });

        if (response.status === 201) {
            const data = await response.json();
            console.log(data);
            // clear page data and incoming data
            incomingRequests = incomingRequests.filter(
                (request) => request.requestedPortId !== requestedPortId,
            );
            portsData = portsData.filter(
                (port) => port.portId !== requestedPortId,
            );
            allRequestData = allRequestData.filter(
                (request) => request.requestedPortId !== requestedPortId,
            );
        }
    }
</script>

{#if !currentUserInfo}
    <div class="flex items-center justify-center h-screen">
        <span class="loading loading-bars loading-lg"></span>
    </div>
{:else if currentUserInfo}
    {#if currentUserIsAdmin}
        {#if !isMobile}
            <div class="flex justify-center items-center h-screen mx-3">
                <div class="grid grid-rows-3 grid-flow-col gap-4">
                    <div class="col-span-2">
                        <div class="card bg-base-100 h-full min-h-52 shadow-xl">
                            <div class="w-full card-body">
                                <div class="m-auto">
                                    {#if currentUserInfo}
                                        <h1 class="card-title text-5xl">
                                            Welcome {currentUserInfo.name}
                                        </h1>
                                    {:else}
                                        <h1 class="card-title text-5xl">
                                            Welcome Guest
                                        </h1>
                                    {/if}
                                    <p>
                                        So glad to see you! Let's get started
                                        with managing people's sessions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row-span-2">
                        <div class="card bg-base-100 h-full shadow-xl">
                            <div class="w-full card-body">
                                <h2 class="card-title">Requests</h2>
                                {#if allRequestData.length === 0}
                                    <div class="chat chat-start">
                                        <div class="chat-bubble">
                                            No requests to be seen here
                                        </div>
                                    </div>
                                    <div class="chat chat-start">
                                        <div class="chat-bubble">:(</div>
                                    </div>
                                {:else}
                                    <div class="overflow-y-auto max-h-80">
                                        <table id="ports-table" class="table">
                                            <thead class="bg-base-200">
                                                <tr>
                                                    <th>Port</th>
                                                    <th>Priority</th>
                                                    <th>User</th>
                                                    <th>Message</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody class="bg-base-300">
                                                {#each allRequestData as request}
                                                    <tr class="p-1">
                                                        <td class="p-2"
                                                            >{request.displayName}</td
                                                        >
                                                        <td class="p-2">
                                                            {#if request.priority === "high"}
                                                                <span
                                                                    class="badge badge-error"
                                                                    >High</span
                                                                >
                                                            {:else if request.priority === "medium"}
                                                                <span
                                                                    class="badge badge-warning"
                                                                    >Medium</span
                                                                >
                                                            {:else}
                                                                <span
                                                                    class="badge badge-success"
                                                                    >Low</span
                                                                >
                                                            {/if}
                                                        </td>
                                                        <td class="p-2">
                                                            {request.name}
                                                        </td>
                                                        <td class="p-2">
                                                            <label
                                                                for="my_modal_{request.requestId}"
                                                                class="btn"
                                                                >Show Message</label
                                                            >
                                                            <input
                                                                type="checkbox"
                                                                id="my_modal_{request.requestId}"
                                                                class="modal-toggle"
                                                            />
                                                            <div
                                                                class="modal"
                                                                role="dialog"
                                                            >
                                                                <div
                                                                    class="modal-box"
                                                                >
                                                                    <h3
                                                                        class="font-bold text-lg"
                                                                    >
                                                                        Message
                                                                    </h3>
                                                                    <p
                                                                        class="py-4 overflow-y-auto max-h-40"
                                                                    >
                                                                        {request.message}
                                                                    </p>
                                                                    <div
                                                                        class="modal-action"
                                                                    >
                                                                        <label
                                                                            for="my_modal_{request.requestId}"
                                                                            class="btn"
                                                                            >Close</label
                                                                        >
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            class="p-2 justify-end"
                                                        >
                                                            <button
                                                                class="btn w-20 text-xs btn-success"
                                                                on:click={() =>
                                                                    approveRequest(
                                                                        request.fromUserId,
                                                                        request.requestedPortId,
                                                                    )}
                                                                >Approve
                                                            </button>
                                                            <button
                                                                class="btn w-20 text-xs btn-error"
                                                                on:click={() =>
                                                                    cancelRequest(
                                                                        request.requestId,
                                                                    )}
                                                                >Cancel
                                                            </button>
                                                        </td>
                                                    </tr>
                                                {/each}
                                            </tbody>
                                        </table>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="row-span-2">
                        <div class="card bg-base-100 h-full shadow-xl">
                            <div class="w-full card-body">
                                <h2 class="card-title">Ports</h2>
                                {#if allOccupiedPorts.length === 0}
                                    <div class="chat chat-start">
                                        <div class="chat-bubble">
                                            It's kind of empty
                                        </div>
                                    </div>
                                    <div class="chat chat-end">
                                        <div class="chat-bubble">Yes it is</div>
                                    </div>
                                {:else}
                                    <div class="overflow-y-auto max-h-80">
                                        <table id="ports-table" class="table">
                                            <thead class="bg-base-200">
                                                <tr>
                                                    <th>Port</th>
                                                    <th>Station ID</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody class="bg-base-300">
                                                {#each allOccupiedPorts as port}
                                                    <tr class="p-1">
                                                        <td class="p-2"
                                                            >{port.displayName}</td
                                                        >
                                                        <td
                                                            class="p-2 break-all"
                                                            >{port.stationId}</td
                                                        >
                                                        <td
                                                            class="p-2 justify-end"
                                                        >
                                                            <button
                                                                class="btn w-24 btn-error"
                                                                on:click={() =>
                                                                    disconnectPort(
                                                                        port.portId,
                                                                        port.stationId,
                                                                    )}
                                                            >
                                                                Disconnect
                                                            </button>
                                                        </td>
                                                    </tr>
                                                {/each}
                                            </tbody>
                                        </table>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {:else}
            <div class="flex justify-center items-center h-screen">
                <div class="h-96 carousel carousel-vertical">
                    <div class="carousel-item h-full">
                        <div class="card w-full bg-base-100">
                            <div class="card-body">
                                <div class="m-auto">
                                    {#if currentUserInfo}
                                        <h1 class="card-title">
                                            Welcome {currentUserInfo.name}
                                        </h1>
                                    {:else}
                                        <h1 class="card-title">
                                            Welcome Guest
                                        </h1>
                                    {/if}
                                    <p>
                                        So glad to see you! Let's get started
                                        with managing people's sessions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-item h-full">
                        <div class="card w-full bg-base-100">
                            <div class="card-body">
                                <h2 class="card-title">Ports</h2>
                                {#if allOccupiedPorts.length === 0}
                                    <div class="chat chat-start">
                                        <div class="chat-bubble">
                                            It's kind of empty
                                        </div>
                                    </div>
                                    <div class="chat chat-end">
                                        <div class="chat-bubble">Yes it is</div>
                                    </div>
                                {:else}
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                            <tr>
                                                <th>Port</th>
                                                <th>Station ID</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
                                            {#each allOccupiedPorts as port}
                                                <tr class="p-1">
                                                    <td class="p-1 text-xs"
                                                        >{port.displayName}</td
                                                    >
                                                    <td
                                                        class="p-1 text-xs break-all"
                                                        >{port.stationId}</td
                                                    >
                                                    <td class="p-1 justify-end">
                                                        <button
                                                            class="btn w-20 text-xs btn-error"
                                                            on:click={() =>
                                                                disconnectPort(
                                                                    port.portId,
                                                                    port.stationId,
                                                                )}
                                                        >
                                                            Disconnect
                                                        </button>
                                                    </td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="carousel-item h-full">
                        <div class="card w-full bg-base-100">
                            <div class="card-body">
                                <h2 class="card-title">Requests</h2>
                                {#if allRequestData.length === 0}
                                    <div class="chat chat-start">
                                        <div class="chat-bubble">
                                            No requests to be seen here
                                        </div>
                                    </div>
                                    <div class="chat chat-start">
                                        <div class="chat-bubble">:)</div>
                                    </div>
                                {:else}
                                    <div class="overflow-y-auto max-h-80">
                                        <table id="ports-table" class="table">
                                            <thead class="bg-base-200">
                                                <tr>
                                                    <th>Port</th>
                                                    <th>Priority</th>
                                                    <th>Message</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody class="bg-base-300">
                                                {#each allRequestData as request}
                                                    <tr class="p-1">
                                                        <td class="p-1 text-xs"
                                                            >{request.displayName}</td
                                                        >
                                                        <td class="p-1">
                                                            {#if request.priority === "high"}
                                                                <span
                                                                    class="badge text-xs badge-error"
                                                                    >High</span
                                                                >
                                                            {:else if request.priority === "medium"}
                                                                <span
                                                                    class="badge text-xs badge-warning"
                                                                    >Medium</span
                                                                >
                                                            {:else}
                                                                <span
                                                                    class="badge text-xs badge-success"
                                                                    >Low</span
                                                                >
                                                            {/if}
                                                        </td>
                                                        <td class="p-1">
                                                            <label
                                                                for="my_modal_{request.requestId}"
                                                                class="btn text-xs"
                                                                >Show Message</label
                                                            >
                                                            <input
                                                                type="checkbox"
                                                                id="my_modal_{request.requestId}"
                                                                class="modal-toggle"
                                                            />
                                                            <div
                                                                class="modal"
                                                                role="dialog"
                                                            >
                                                                <div
                                                                    class="modal-box"
                                                                >
                                                                    <h3
                                                                        class="font-bold text-lg"
                                                                    >
                                                                        Message
                                                                    </h3>
                                                                    <p
                                                                        class="py-4 overflow-y-auto max-h-40"
                                                                    >
                                                                        {request.message}
                                                                    </p>
                                                                    <div
                                                                        class="modal-action"
                                                                    >
                                                                        <label
                                                                            for="my_modal_{request.requestId}"
                                                                            class="btn"
                                                                            >Close</label
                                                                        >
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            class="p-1 justify-end"
                                                        >
                                                            <button
                                                                class="btn w-20 text-xs btn-success"
                                                                on:click={() =>
                                                                    approveRequest(
                                                                        request.fromUserId,
                                                                        request.requestedPortId,
                                                                    )}
                                                                >Approve
                                                            </button>
                                                            <button
                                                                class="btn w-20 text-xs btn-error mt-1"
                                                                on:click={() =>
                                                                    cancelRequest(
                                                                        request.requestId,
                                                                    )}
                                                                >Disapprove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                {/each}
                                            </tbody>
                                        </table>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    {:else if !isMobile}
        <div class="flex justify-center items-center h-screen mx-3">
            <div class="grid grid-rows-3 grid-flow-col gap-4">
                <div class="">
                    {#if currentUserInfo}
                        {#if currentUserInfo.carModel === null}
                            <dialog id="my_modal_1" class="modal modal-open">
                                <div class="modal-box">
                                    <h3 class="font-bold text-lg">
                                        Please select your car:
                                    </h3>
                                    {#if cars}
                                        <div class="carousel w-full">
                                            {#each keys as key, i}
                                                <div
                                                    id="slide{i + 1}"
                                                    class="carousel-item relative w-full flex justify-center"
                                                >
                                                    <div
                                                        class="card no-background card-compact"
                                                    >
                                                        <div class="card-body">
                                                            <h2
                                                                class="card-title"
                                                            >
                                                                {key}
                                                            </h2>
                                                            <div
                                                                class="overflow-x-auto w-full"
                                                            >
                                                                <table
                                                                    class="table w-full fixed-width-table rounded-table"
                                                                >
                                                                    <thead>
                                                                        <tr>
                                                                            <th
                                                                                >Model
                                                                            </th>
                                                                            <th
                                                                                >Select
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody
                                                                        class="bg-base-300"
                                                                    >
                                                                        {#each cars[key] as car}
                                                                            <tr>
                                                                                <td
                                                                                >
                                                                                    <div
                                                                                        class="flex items-center space-x-3"
                                                                                    >
                                                                                        <div
                                                                                            class="avatar"
                                                                                        >
                                                                                            <div
                                                                                                class="mask mask-squircle w-12 h-12"
                                                                                            >
                                                                                                <img
                                                                                                    src="/assets/makes/{key}.svg"
                                                                                                    alt="{key} logo"
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div
                                                                                        >
                                                                                            {car.model}
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td
                                                                                    class="text-center"
                                                                                >
                                                                                    <label
                                                                                    >
                                                                                        <input
                                                                                            type="radio"
                                                                                            name="car"
                                                                                            value={car.model}
                                                                                            class="radio"
                                                                                            on:change={ChooseCar}
                                                                                        />
                                                                                    </label>
                                                                                </td>
                                                                            </tr>
                                                                        {/each}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        class="absolute flex justify-between transform left-4 right-4 top-1/2"
                                                    >
                                                        <button
                                                            class="btn btn-circle"
                                                            on:click={() =>
                                                                navigateToSlide(
                                                                    i === 0
                                                                        ? keys.length
                                                                        : i,
                                                                )}
                                                            >❮
                                                        </button>
                                                        <button
                                                            class="btn btn-circle"
                                                            on:click={() =>
                                                                navigateToSlide(
                                                                    i ===
                                                                        keys.length -
                                                                            1
                                                                        ? 1
                                                                        : i + 2,
                                                                )}
                                                            >❯
                                                        </button>
                                                    </div>
                                                </div>
                                            {/each}
                                        </div>
                                        <label
                                            for="quantity-input"
                                            class="block mb-2 text-sm font-medium"
                                            >Select your current battery %:</label
                                        >
                                        <input
                                            type="range"
                                            id="quantity-input"
                                            min="0"
                                            max="100"
                                            step="10"
                                            class="range range-primary"
                                            bind:value={percentage_charge}
                                        />
                                        <div
                                            class="w-full flex justify-between text-xs px-2"
                                        >
                                            <span>0%</span>
                                            <span>10%</span>
                                            <span>20%</span>
                                            <span>30%</span>
                                            <span>40%</span>
                                            <span>50%</span>
                                            <span>60%</span>
                                            <span>70%</span>
                                            <span>80%</span>
                                            <span>90%</span>
                                            <span>100%</span>
                                        </div>
                                    {:else}
                                        <p>No cars available</p>
                                    {/if}
                                    <div class="modal-action">
                                        <form method="dialog">
                                            {#if CarOfChoice && percentage_charge !== 0}
                                                <button
                                                    class="btn"
                                                    on:click={DoneChoosingCar}
                                                    >Done
                                                </button>
                                            {:else}
                                                <button class="btn" disabled
                                                    >Done
                                                </button>
                                            {/if}
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        {/if}
                    {/if}
                    <div class="card bg-base-100 h-full min-h-52 shadow-xl">
                        <div class="w-full card-body">
                            <div class="m-auto">
                                {#if currentUserInfo}
                                    <h1 class="card-title text-5xl">
                                        Welcome {currentUserInfo.name}
                                    </h1>
                                {:else}
                                    <h1 class="card-title text-5xl">
                                        Welcome Guest
                                    </h1>
                                {/if}
                                <p>
                                    So glad to see you! Let's get started with
                                    managing your session.
                                </p>
                                {#if currentUserInfo?.carModel}
                                    <div class="mt-4">
                                        <p>
                                            Your Car:
                                            {#if currentUserInfo.carModel}
                                                {keys.find((key) =>
                                                    cars[key].some(
                                                        (car) =>
                                                            car.model ===
                                                            currentUserInfo.carModel,
                                                    ),
                                                )}
                                                {currentUserInfo.carModel}
                                            {/if}
                                        </p>
                                        {#if currentUserInfo.BatteryCurrent}
                                            <progress
                                                class="progress progress-primary w-full"
                                                value={carCharge}
                                                max="100"
                                            ></progress>
                                            <p>
                                                Battery: {carCharge}%
                                            </p>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row-span-2">
                    <div class="card bg-base-100 h-full shadow-xl">
                        <div class="w-full card-body">
                            <h2 class="card-title">Incoming Requests</h2>
                            {#if incomingRequests.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">
                                        No incoming requests to be seen here
                                    </div>
                                </div>
                                <div class="chat chat-start">
                                    <div class="chat-bubble">:(</div>
                                </div>
                            {:else}
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                            <tr>
                                                <th>Port</th>
                                                <th>Priority</th>
                                                <th>Message</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
                                            {#each incomingRequests as request}
                                                <tr class="p-1">
                                                    <td class="p-2"
                                                        >{request.displayName}</td
                                                    >
                                                    <td class="p-2">
                                                        {#if request.priority === "high"}
                                                            <span
                                                                class="badge badge-error"
                                                                >High</span
                                                            >
                                                        {:else if request.priority === "medium"}
                                                            <span
                                                                class="badge badge-warning"
                                                                >Medium</span
                                                            >
                                                        {:else}
                                                            <span
                                                                class="badge badge-success"
                                                                >Low</span
                                                            >
                                                        {/if}
                                                    </td>
                                                    <td class="p-2">
                                                        <label
                                                            for="my_modal_{request.requestId}"
                                                            class="btn"
                                                            >Show Message</label
                                                        >
                                                        <input
                                                            type="checkbox"
                                                            id="my_modal_{request.requestId}"
                                                            class="modal-toggle"
                                                        />
                                                        <div
                                                            class="modal"
                                                            role="dialog"
                                                        >
                                                            <div
                                                                class="modal-box"
                                                            >
                                                                <h3
                                                                    class="font-bold text-lg"
                                                                >
                                                                    Message
                                                                </h3>
                                                                <p
                                                                    class="py-4 overflow-y-auto max-h-40"
                                                                >
                                                                    {request.message}
                                                                </p>
                                                                <div
                                                                    class="modal-action"
                                                                >
                                                                    <label
                                                                        for="my_modal_{request.requestId}"
                                                                        class="btn"
                                                                        >Close</label
                                                                    >
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="p-2 justify-end">
                                                        <button
                                                            class="btn w-24 btn-success"
                                                            on:click={() =>
                                                                approveRequest(
                                                                    request.fromUserId,
                                                                    request.requestedPortId,
                                                                )}
                                                        >
                                                            Approve
                                                        </button>
                                                    </td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="">
                    <div class="card bg-base-100 h-full min-h-52 shadow-xl">
                        <div class="w-full card-body">
                            <h2 class="card-title">My Port</h2>
                            {#if portsData.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">
                                        It's kind of empty
                                    </div>
                                </div>
                                <div class="chat chat-end">
                                    <div class="chat-bubble">Yes it is</div>
                                </div>
                            {:else}
                                <table id="ports-table" class="table">
                                    <thead class="bg-base-200">
                                        <tr>
                                            <th>Port</th>
                                            <th>Station ID</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-base-300">
                                        {#each portsData as port}
                                            <tr class="p-1">
                                                <td class="p-2"
                                                    >{port.displayName}</td
                                                >
                                                <td class="p-2 break-all"
                                                    >{port.stationId}</td
                                                >
                                                <td class="p-2 justify-end">
                                                    <button
                                                        class="btn w-24 btn-error"
                                                        on:click={() =>
                                                            disconnectPort(
                                                                port.portId,
                                                                port.stationId,
                                                            )}
                                                    >
                                                        Disconnect
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="row-span-2">
                    <div class="card bg-base-100 h-full shadow-xl">
                        <div class="w-full card-body">
                            <h2 class="card-title">My Requests</h2>
                            {#if requestPageData.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">
                                        No requests to be seen here
                                    </div>
                                </div>
                                <div class="chat chat-start">
                                    <div class="chat-bubble">:)</div>
                                </div>
                            {:else}
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                            <tr>
                                                <th>Port</th>
                                                <th>Priority</th>
                                                <th>Message</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
                                            {#each requestPageData as request}
                                                <tr class="p-1">
                                                    <td class="p-2"
                                                        >{request.displayName}</td
                                                    >
                                                    <td class="p-2">
                                                        {#if request.priority === "high"}
                                                            <span
                                                                class="badge badge-error"
                                                                >High</span
                                                            >
                                                        {:else if request.priority === "medium"}
                                                            <span
                                                                class="badge badge-warning"
                                                                >Medium</span
                                                            >
                                                        {:else}
                                                            <span
                                                                class="badge badge-success"
                                                                >Low</span
                                                            >
                                                        {/if}
                                                    </td>
                                                    <td class="p-2">
                                                        <label
                                                            for="my_modal_{request.requestId}"
                                                            class="btn"
                                                            >Show Message</label
                                                        >
                                                        <input
                                                            type="checkbox"
                                                            id="my_modal_{request.requestId}"
                                                            class="modal-toggle"
                                                        />
                                                        <div
                                                            class="modal"
                                                            role="dialog"
                                                        >
                                                            <div
                                                                class="modal-box"
                                                            >
                                                                <h3
                                                                    class="font-bold text-lg"
                                                                >
                                                                    Message
                                                                </h3>
                                                                <p
                                                                    class="py-4 overflow-y-auto max-h-40"
                                                                >
                                                                    {request.message}
                                                                </p>
                                                                <div
                                                                    class="modal-action"
                                                                >
                                                                    <label
                                                                        for="my_modal_{request.requestId}"
                                                                        class="btn"
                                                                        >Close</label
                                                                    >
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="p-2 justify-end">
                                                        <button
                                                            class="btn w-24 btn-error"
                                                            on:click={() =>
                                                                cancelRequest(
                                                                    request.requestId,
                                                                )}
                                                            >Cancel
                                                        </button>
                                                    </td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="flex justify-center items-center h-screen">
            <div class="h-96 carousel carousel-vertical">
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
                            <div class="m-auto">
                                {#if currentUserInfo}
                                    <h1 class="card-title text-5xl">
                                        Welcome {currentUserInfo.name}
                                    </h1>
                                {:else}
                                    <h1 class="card-title text-5xl">
                                        Welcome Guest
                                    </h1>
                                {/if}
                                <p>
                                    So glad to see you! Let's get started with
                                    managing your session.
                                </p>
                                {#if currentUserInfo?.carModel}
                                    <div class="mt-4">
                                        <p>
                                            Your Car: {currentUserInfo.carModel}
                                        </p>
                                        <progress
                                            class="progress progress-primary w-full"
                                            value={currentUserInfo.BatteryCurrent}
                                            max={currentUserInfo.BatteryMax}
                                        ></progress>
                                        <p>
                                            Battery: {currentUserInfo.BatteryCurrent}%
                                        </p>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title">My Port</h2>
                            {#if portsData.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">
                                        It's kind of empty
                                    </div>
                                </div>
                                <div class="chat chat-end">
                                    <div class="chat-bubble">Yes it is</div>
                                </div>
                            {:else}
                                <table id="ports-table" class="table">
                                    <thead class="bg-base-200">
                                        <tr>
                                            <th>Port</th>
                                            <th>Station ID</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-base-300">
                                        {#each portsData as port}
                                            <tr class="p-1">
                                                <td class="p-1 text-xs"
                                                    >{port.displayName}</td
                                                >
                                                <td
                                                    class="p-1 text-xs break-all"
                                                    >{port.stationId}</td
                                                >
                                                <td class="p-1 justify-end">
                                                    <button
                                                        class="btn w-20 text-xs btn-error"
                                                        on:click={() =>
                                                            disconnectPort(
                                                                port.portId,
                                                                port.stationId,
                                                            )}
                                                    >
                                                        Disconnect
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title">My Requests</h2>
                            {#if requestPageData.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">
                                        No requests to be seen here
                                    </div>
                                </div>
                                <div class="chat chat-start">
                                    <div class="chat-bubble">:)</div>
                                </div>
                            {:else}
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                            <tr>
                                                <th>Port</th>
                                                <th>Priority</th>
                                                <th>Message</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
                                            {#each requestPageData as request}
                                                <tr class="p-1">
                                                    <td class="p-1 text-xs"
                                                        >{request.displayName}</td
                                                    >
                                                    <td class="p-1">
                                                        {#if request.priority === "high"}
                                                            <span
                                                                class="badge text-xs badge-error"
                                                                >High</span
                                                            >
                                                        {:else if request.priority === "medium"}
                                                            <span
                                                                class="badge text-xs badge-warning"
                                                                >Medium</span
                                                            >
                                                        {:else}
                                                            <span
                                                                class="badge text-xs badge-success"
                                                                >Low</span
                                                            >
                                                        {/if}
                                                    </td>
                                                    <td class="p-1">
                                                        <label
                                                            for="my_modal_{request.requestId}"
                                                            class="btn text-xs"
                                                            >Show Message</label
                                                        >
                                                        <input
                                                            type="checkbox"
                                                            id="my_modal_{request.requestId}"
                                                            class="modal-toggle"
                                                        />
                                                        <div
                                                            class="modal"
                                                            role="dialog"
                                                        >
                                                            <div
                                                                class="modal-box"
                                                            >
                                                                <h3
                                                                    class="font-bold text-lg"
                                                                >
                                                                    Message
                                                                </h3>
                                                                <p
                                                                    class="py-4 overflow-y-auto max-h-40"
                                                                >
                                                                    {request.message}
                                                                </p>
                                                                <div
                                                                    class="modal-action"
                                                                >
                                                                    <label
                                                                        for="my_modal_{request.requestId}"
                                                                        class="btn"
                                                                        >Close</label
                                                                    >
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        class="p-1 justify-end"
                                                    >
                                                        <button
                                                            class="btn w-20 text-xs btn-error"
                                                            on:click={() =>
                                                                cancelRequest(
                                                                    request.requestId,
                                                                )}
                                                            >Cancel
                                                        </button>
                                                    </td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="carousel-item h-full">
                    <div class="card w-full bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title">Incoming Requests</h2>
                            {#if incomingRequests.length === 0}
                                <div class="chat chat-start">
                                    <div class="chat-bubble">
                                        No incoming requests to be seen here
                                    </div>
                                </div>
                                <div class="chat chat-start">
                                    <div class="chat-bubble">:(</div>
                                </div>
                            {:else}
                                <div class="overflow-y-auto max-h-80">
                                    <table id="ports-table" class="table">
                                        <thead class="bg-base-200">
                                            <tr>
                                                <th>Port</th>
                                                <th>Priority</th>
                                                <th>Message</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-base-300">
                                            {#each incomingRequests as request}
                                                <tr class="p-1">
                                                    <td class="p-1 text-xs"
                                                        >{request.displayName}</td
                                                    >
                                                    <td class="p-1">
                                                        {#if request.priority === "high"}
                                                            <span
                                                                class="badge text-xs badge-error"
                                                                >High</span
                                                            >
                                                        {:else if request.priority === "medium"}
                                                            <span
                                                                class="badge text-xs badge-warning"
                                                                >Medium</span
                                                            >
                                                        {:else}
                                                            <span
                                                                class="badge text-xs badge-success"
                                                                >Low</span
                                                            >
                                                        {/if}
                                                    </td>
                                                    <td class="p-1">
                                                        <label
                                                            for="my_modal_{request.requestId}"
                                                            class="btn text-xs"
                                                            >Show Message</label
                                                        >
                                                        <input
                                                            type="checkbox"
                                                            id="my_modal_{request.requestId}"
                                                            class="modal-toggle"
                                                        />
                                                        <div
                                                            class="modal"
                                                            role="dialog"
                                                        >
                                                            <div
                                                                class="modal-box"
                                                            >
                                                                <h3
                                                                    class="font-bold text-lg"
                                                                >
                                                                    Message
                                                                </h3>
                                                                <p
                                                                    class="py-4 overflow-y-auto max-h-40"
                                                                >
                                                                    {request.message}
                                                                </p>
                                                                <div
                                                                    class="modal-action"
                                                                >
                                                                    <label
                                                                        for="my_modal_{request.requestId}"
                                                                        class="btn"
                                                                        >Close</label
                                                                    >
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        class="p-1 justify-end"
                                                    >
                                                        <button
                                                            class="btn w-20 text-xs btn-success"
                                                            on:click={() =>
                                                                approveRequest(
                                                                    request.fromUserId,
                                                                    request.requestedPortId,
                                                                )}
                                                        >
                                                            Approve
                                                        </button>
                                                    </td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
{/if}
