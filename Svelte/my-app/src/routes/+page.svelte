<script lang="ts">
    let isLoading = false;
    let email = '';
    let password = '';
    let isEmailError = false;
    let isPasswordError = false;
    let alertMessageDisplay = false;
    let alertMessage = ''

    async function handleLoginKey(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            if (email === '' || password === '') {
                return;
            }

            await handleLogin();
        }
    }

    async function handleLogin() {
        isLoading = true;

        if (email === '' || password === '') {
            if (email === '') {
                isEmailError = true;
            }
            if (password === '') {
                isPasswordError = true;
            }
            alertMessageDisplay = true;
            alertMessage = 'Please fill in all fields';
            isLoading = false;
            return;
        }

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        isLoading = false;

        if (response.status === 201) {
            window.location.href = '/home';
        } else {
            alertMessageDisplay = true;
            alertMessage = 'Invalid email or password';
            email = '';
            password = '';
        }
    }

    function handleInput() {
        if (email !== '') {
            isEmailError = false;
        }
        if (password !== '') {
            isPasswordError = false;
        }

        if (alertMessage === 'Invalid email or password') {
            alertMessageDisplay = false;
        }

        if (alertMessageDisplay && email !== '' && password !== '') {
            alertMessageDisplay = false;
        }
    }
</script>

{#if alertMessageDisplay}
    <div role="alert"
         class="alert alert-error animate-slide-down flex w-11/12 mt-2.5 lg:mt-2.5 mx-auto absolute top-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <span>{alertMessage}</span>
    </div>
{/if}

<div class="flex items-center justify-center h-screen">
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <!--            <label class="input input-bordered flex items-center gap-2">-->
            <!--                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>-->
            <!--                <input type="text" class="grow" placeholder="Full Name" />-->
            <!--            </label>-->
            <h2 class="card-title">Login</h2>
            <label class="input input-bordered {isEmailError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                     class="w-4 h-4 opacity-70">
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                </svg>
                <input type="text" class="grow" placeholder="Email" bind:value={email} on:keydown={handleLoginKey}
                       on:input={handleInput}/>
            </label>
            <label class="input input-bordered {isPasswordError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                     class="w-4 h-4 opacity-70">
                    <path fill-rule="evenodd"
                          d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                          clip-rule="evenodd"/>
                </svg>
                <input type="password" class="grow" placeholder="Password" bind:value={password}
                       on:keydown={handleLoginKey} on:input={handleInput}/>
            </label>
            <button class="btn btn-block" on:click={handleLogin}>
                {#if isLoading}
                    <span class="loading loading-spinner"></span>
                {:else}
                    Login
                {/if}
            </button>
            <a href="/register" class="link link-hover">Register</a>
        </div>
    </div>
</div>