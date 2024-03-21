<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import { theme } from '../../../routes/theme/theme'; // Import the theme store

    const dispatch = createEventDispatcher();
    export let show = false;
    let selectedTheme: string = 'default';
    if (typeof window !== 'undefined') {
        selectedTheme = window.localStorage.getItem('theme') || 'default';
    }

    const close = () => {
        show = false;
        dispatch("close");
    }

    const changeTheme = (themeName: string) => {
        selectedTheme = themeName;
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('theme', themeName);
        }
        theme.set(themeName); // Update the theme store
        document.documentElement.className = themeName;
    }
</script>

{#if show}
    <div class="fixed inset-0 flex items-center justify-center">
        <div class="card w-80 glass text-primary-content lg:w-96">
            <div class="card-body">
                <h2 class="card-title">Appearance</h2>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Default</span>
                        <input type="radio" name="theme-radios" class="radio theme-controller" value="default"
                               bind:group={selectedTheme} on:change={() => changeTheme('default')}/>
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Light</span>
                        <input type="radio" name="theme-radios" class="radio theme-controller" value="light"
                               bind:group={selectedTheme} on:change={() => changeTheme('light')}/>
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Dark</span>
                        <input type="radio" name="theme-radios" class="radio theme-controller" value="dark"
                               bind:group={selectedTheme} on:change={() => changeTheme('dark')}/>
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Retro</span>
                        <input type="radio" name="theme-radios" class="radio theme-controller" value="retro"
                               bind:group={selectedTheme} on:change={() => changeTheme('retro')}/>
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Cyberpunk</span>
                        <input type="radio" name="theme-radios" class="radio theme-controller" value="cyberpunk"
                               bind:group={selectedTheme} on:change={() => changeTheme('cyberpunk')}/>
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Valentine</span>
                        <input type="radio" name="theme-radios" class="radio theme-controller" value="valentine"
                               bind:group={selectedTheme} on:change={() => changeTheme('valentine')}/>
                    </label>
                </div>
                <div class="card-actions justify-end">
                    <button class="btn" on:click={close}>Close</button>
                </div>
            </div>
        </div>
    </div>
{/if}