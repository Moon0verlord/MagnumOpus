<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    import { theme } from "../../../routes/theme/theme"; // Import the theme store

    const dispatch = createEventDispatcher();
    export let show = false;
    let selectedTheme: string = "default";
    if (typeof window !== "undefined") {
        selectedTheme = window.localStorage.getItem("theme") || "default";
    }

    const close = () => {
        show = false;
        dispatch("close");
    };

    const changeTheme = (themeName: string) => {
        selectedTheme = themeName;
        if (typeof window !== "undefined") {
            window.localStorage.setItem("theme", themeName);
        }
        theme.set(themeName); // Update the theme store
        document.documentElement.className = themeName;
    };
</script>

{#if show}
    <div
        class="fixed inset-0 flex items-center justify-center"
        transition:fly={{ duration: 200 }}
    >
        <div class="card w-80 glass lg:w-96">
            <div class="card-body">
                <h2 class="card-title">Appearance</h2>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Light</span>
                        <input
                            type="radio"
                            name="theme-radios"
                            class="radio theme-controller"
                            value="light"
                            bind:group={selectedTheme}
                            on:change={() => changeTheme("light")}
                        />
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Dark</span>
                        <input
                            type="radio"
                            name="theme-radios"
                            class="radio theme-controller"
                            value="dark"
                            bind:group={selectedTheme}
                            on:change={() => changeTheme("dark")}
                        />
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Black</span>
                        <input
                            type="radio"
                            name="theme-radios"
                            class="radio theme-controller"
                            value="black"
                            bind:group={selectedTheme}
                            on:change={() => changeTheme("black")}
                        />
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Retro</span>
                        <input
                            type="radio"
                            name="theme-radios"
                            class="radio theme-controller"
                            value="retro"
                            bind:group={selectedTheme}
                            on:change={() => changeTheme("retro")}
                        />
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Forest</span>
                        <input
                            type="radio"
                            name="theme-radios"
                            class="radio theme-controller"
                            value="forest"
                            bind:group={selectedTheme}
                            on:change={() => changeTheme("forest")}
                        />
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Autumn</span>
                        <input type="radio" name="theme-radios" class="radio theme-controller" value="autumn"
                               bind:group={selectedTheme} on:change={() => changeTheme('autumn')}/>
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer gap-4">
                        <span class="label-text">Business</span>
                        <input type="radio" name="theme-radios" class="radio theme-controller" value="business"
                               bind:group={selectedTheme} on:change={() => changeTheme('business')}/>
                    </label>
                </div>
                <div class="card-actions justify-end">
                    <button class="btn" on:click={close}>Close</button>
                </div>
            </div>
        </div>
    </div>
{/if}
