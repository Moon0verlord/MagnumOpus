<script>
    import SettingsModal from "$lib/components/dialogs/settingsModal.svelte";

    let showModal = false;

    let theme = 'retro';

    if (typeof window !== 'undefined') {
        const localTheme = localStorage.getItem('theme');
        if (localTheme) {
            theme = localTheme;
        }
    }

    const openSettings = () => {
        showModal = true;
    };
</script>

<!-- Settings -->
<ul class="menu bg-base-200 w-90 rounded-box ml-2.5 mr-2.5 mt-2.5">
    <li class="menu-title">Settings</li>
    <li><a href="/settings">Account</a></li>
    <li><a href="/settings">Notifications</a></li>
    <li>
        <button on:click={openSettings}>Appearance</button>
    </li>
    <li><a href="/settings">Privacy</a></li>
    <li><a href="/settings">Help & Support</a></li>
    <li><a href="/settings">About</a></li>
</ul>

<!-- Logout -->
<ul class="menu bg-base-200 w-90 rounded-box ml-2.5 mr-2.5 mt-2.5">
    <li><a href="/">Logout</a></li>
</ul>

<!-- Appearance Modal -->
<SettingsModal show={showModal} on:close={() => showModal = false}/>