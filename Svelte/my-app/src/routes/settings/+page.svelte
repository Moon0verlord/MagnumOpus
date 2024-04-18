<script>
    import SettingsModal from "$lib/components/dialogs/settingsModal.svelte";
    import {userId} from "../../store";

    let showModal = false;

    const openSettings = () => {
        showModal = true;
    };
    
    function logout() {
        userId.set(null);
        sessionStorage.removeItem('userId');
        window.location.href = '/';
    }
    
</script>

<!-- Menu -->
<div class="flex justify-center items-center h-screen w-screen">
    <div class="w-3/4">
    <!-- Settings Menu -->
    <ul class="menu bg-base-200 shadow-xl rounded-box ml-2.5 mr-2.5 mt-2.5">
        <li class="menu-title">Settings</li>
        <li><a href="/account">Account</a></li>
        <li><a href="/notifications">Notifications</a></li>
        <li>
            <button on:click={openSettings}>Appearance</button>
        </li>
        <li class="menu-title">Information</li>
        <li><a href="/settings">Privacy</a></li>
        <li><a href="/settings">Help & Support</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/test">???</a></li>
        <li><label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer">
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Do not disturb</span>
        </label></li>
    </ul>

    <!-- Logout -->
    <ul class="menu bg-base-200 shadow-xl rounded-box ml-2.5 mr-2.5 mt-2.5">
        <li><a href="/" on:click|preventDefault={logout}>Logout</a></li>
    </ul>
    </div>

    <!-- Appearance Modal -->
    <SettingsModal show={showModal} on:close={() => showModal = false}/>
</div>