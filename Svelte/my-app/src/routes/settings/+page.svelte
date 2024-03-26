<script>
    import SettingsModal from "$lib/components/dialogs/settingsModal.svelte";

    let showModal = false;

    const openSettings = () => {
        showModal = true;
    };
</script>

<!-- Menu -->
<div class="flex justify-center items-center h-screen w-screen">
    <div class="w-3/4">
    <!-- Settings Menu -->
    <ul class="menu bg-base-200 shadow-xl rounded-box ml-2.5 mr-2.5 mt-2.5">
        <li class="menu-title">Settings</li>
        <li><a href="/settings">Account</a></li>
        <li><a href="/settings">Notifications</a></li>
        <li>
            <button on:click={openSettings}>Appearance</button>
        </li>
        <li class="menu-title">Information</li>
        <li><a href="/settings">Privacy</a></li>
        <li><a href="/settings">Help & Support</a></li>
        <li><a href="/settings">About</a></li>
        <li><a href="/test">???</a></li>
    </ul>

    <!-- Logout -->
    <ul class="menu bg-base-200 shadow-xl rounded-box ml-2.5 mr-2.5 mt-2.5">
        <li><a href="/">Logout</a></li>
    </ul>
    </div>

    <!-- Appearance Modal -->
    <SettingsModal show={showModal} on:close={() => showModal = false}/>
</div>