<script>
    import SettingsModal from "$lib/components/dialogs/settingsModal.svelte";
    import { userId } from "../../store";
    import oktaAuth from "../../oktaAuth";
    import ChangePasswordModal from "$lib/components/dialogs/PasswordModal.svelte";

    let showChangePasswordModal = false;
    let showSetModal = false;

    const openSettings = () => {
        showSetModal = true;
    };
    
 // Adjust the path as necessary
    function logout() {
        userId.set(null);
        document.cookie = `userId=Expired; SameSite=None; path=/; Secure`;

        // Attempt to log out from Okta
        oktaAuth
            .signOut({
                postLogoutRedirectUri: window.location.origin,
            })
            // @ts-ignore
            .catch((error) => {
                console.error("Logout failed:", error);
                // Optionally handle failed logout attempts here
                window.location.href = "/"; // Fallback redirect if logout fails
            });
    }
</script>

<!-- Menu -->
<div class="flex justify-center items-center h-screen w-screen">
    <div class="w-3/4">
    <!-- Settings Menu -->
    <ul class="menu bg-base-200 shadow-xl rounded-box ml-2.5 mr-2.5 mt-2.5">
        <li class="menu-title">Settings</li>
        <li><a href="/account">Account</a></li>
        <li>
            <button on:click={openSettings}>Appearance</button>
        </li>
        <li><button on:click={() => (showChangePasswordModal = true)}>Change Password</button
        >
        </li>
    </ul>

        <!-- Logout -->
        <ul class="menu bg-base-200 shadow-xl rounded-box ml-2.5 mr-2.5 mt-2.5">
            <li><a href="/" on:click|preventDefault={logout}>Logout</a></li>
        </ul>
    </div>

    <!-- Appearance Modal -->
    <SettingsModal
        show={showSetModal}
        on:close={() => (showSetModal = false)}
    />
    <ChangePasswordModal bind:show={showChangePasswordModal} />
</div>
