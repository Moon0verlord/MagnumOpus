<script lang="ts">
  
    import {mobile} from '../mobile/mobile';

    $: isMobile = $mobile;
    let isSuccess = false;
    let isLoading = false;
    let name = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let isNameError = false;
    let isEmailError = false;
    let isPasswordError = false;
    let isConfirmPasswordError = false;
    let isPasswordMatchError = false;
    let alertMessageDisplay = false;
    let alertMessage = ''

    async function handleRegisterKey(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            if (name === '' || email === '' || password === '' || confirmPassword === '') {
                return;
            }

            await handleRegister();
        }
    }

    async function handleRegister() {
        isLoading = true;

        if (name === '' || email === '' || password === '' || confirmPassword === '') {
            if (name === '') {
                isNameError = true;
            }
            if (email === '') {
                isEmailError = true;
            }
            if (password === '') {
                isPasswordError = true;
            }
            if (confirmPassword === '') {
                isConfirmPasswordError = true;
            }

            alertMessageDisplay = true;
            alertMessage = 'Please fill in all fields';
            isLoading = false;

            setTimeout(() => {
            alertMessageDisplay = false;}, 5000);
            return;

        }

        if (password !== confirmPassword) {
            alertMessageDisplay = true;
            alertMessage = 'Password does not match';
            isLoading = false;
            setTimeout(() => {
            alertMessageDisplay = false;}, 5000);
            return;
        }
        isLoading = true;

        const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
      });

      console.log(response.status);

      if (response.status === 201) {
          isSuccess = true;
          alertMessageDisplay = true;
          alertMessage = 'Registration successful';
      } else {
          alertMessageDisplay = true;
          alertMessage = 'Registration failed';
      }
      isLoading = false;

      setTimeout(() => {
            alertMessageDisplay = false;
        }, 5000);

    }

    function handleInput() {
        if (name !== '') {
            isNameError = false;
        }
        if (email !== '') {
            isEmailError = false;
        }
        if (password !== '') {
            isPasswordError = false;
        }
        if (confirmPassword !== '') {
            isConfirmPasswordError = false;
        }

        if (alertMessage === 'Registration failed') {
            alertMessageDisplay = false;
        }

        if (alertMessageDisplay && name !== '' && email !== '' && password !== '' && confirmPassword !== '') {
            alertMessageDisplay = false;
        }
    }
</script>

{#if alertMessageDisplay}
    <div role="alert"
    class={`alert animate-slide-down flex w-1/2 mt-2.5 lg:mt-2.5 mx-auto absolute top-0 left-0 right-0 ${isSuccess ? 'alert-success' : 'alert-error'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <span>{alertMessage}</span>
    </div>
{/if}


{#if isMobile}
<!-- Register Mobile -->
<div class="flex items-center justify-center h-screen">
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <h2 class="card-title">Register</h2>
            <label class="input input-bordered {isNameError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                     class="w-4 h-4 opacity-70">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"/>
                </svg>
                <input type="text" class="grow" placeholder="Full Name" bind:value={name} on:keydown={handleRegisterKey}
                       on:input={handleInput}/>
            </label>
            <label class="input input-bordered {isEmailError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                     class="w-4 h-4 opacity-70">
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                </svg>
                <input type="text" class="grow" placeholder="Email" bind:value={email} on:keydown={handleRegisterKey}
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
                       on:keydown={handleRegisterKey} on:input={handleInput}/>
            </label>
            <label class="input input-bordered {isConfirmPasswordError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                     class="w-4 h-4 opacity-70">
                    <path fill-rule="evenodd"
                          d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                          clip-rule="evenodd"/>
                </svg>
                <input type="password" class="grow" placeholder="Confirm Password" bind:value={confirmPassword}
                       on:keydown={handleRegisterKey} on:input={handleInput}/>
            </label>
            <button class="btn btn-block" on:click={handleRegister}>
                {#if isLoading}
                    <span class="loading loading-spinner"></span>
                {:else}
                    Register
                {/if}
            </button>
            <div class="label">
                <span class="label-text-alt">
                    <a href="/" class="link link-hover">Login</a>
                </span>
            </div>
        </div>
    </div>
</div>


{:else}

<div class="w-full grid min-h-screen grid-cols-2 xl:min-h-[100vh]">
    <!-- Blank section with logo and quote on the left -->
    <div class="flex flex-col justify-between p-12 bg-base-200 text-base-content">
      <div class="relative z-20 flex items-center text-lg font-medium">
        <img src="src/lib/assets/logo.svg" alt="Logo" class="w-10 h-10 mr-" />
        <h2 class="text-2xl font-bold mb-1">Schuberg Philis</h2>
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            "Bazinga!"
          </p>
          <footer class="text-sm">—Sheldon Cooper</footer>
        </blockquote>
      </div>
    </div>
    
    <!-- Registration section on the right -->
    <div class="flex items-center justify-center bg-base-100 py-12 lg:min-h-[600px] xl:min-h-[100vh]">
      <div class="w-full max-w-md px-4">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-center mb-4">Register</h1>
          <form on:submit|preventDefault={handleRegister}>
            <div class="mb-4">
              <label class="input input-bordered {isNameError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <input type="text" class="grow" placeholder="Full Name" bind:value={name} on:input={handleInput}/>
              </label>
            </div>
            <div class="mb-4">
              <label class="input input-bordered {isEmailError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <input type="text" class="grow" placeholder="Email" bind:value={email} on:input={handleInput}/>
              </label>
            </div>
            <div class="mb-4">
              <label class="input input-bordered {isPasswordError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <input type="password" class="grow" placeholder="Password" bind:value={password} on:input={handleInput}/>
              </label>
            </div>
            <div class="mb-6">
              <label class="input input-bordered {isConfirmPasswordError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <input type="password" class="grow" placeholder="Confirm Password" bind:value={confirmPassword} on:input={handleInput}/>
              </label>
            </div>
            <button type="submit" class="btn btn-primary w-full">Register</button>
          </form>
        </div>
        <p class="text-center text-sm">
          Already have an account?
          <a href="/" class="link link-hover">Login</a>
        </p>
      </div>
    </div>
  </div>

{/if}  