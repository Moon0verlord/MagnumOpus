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

    function validateName(name: string): boolean {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
    }

    function validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password: string): boolean {
        // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!#%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

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

       // Reset error states
       isNameError = false;
       isEmailError = false;
       isPasswordError = false;
       isConfirmPasswordError = false;
       isPasswordMatchError = false;
       isSuccess = false;

       // Validate inputs
       if (!validateName(name)) {
           isNameError = true;
           alertMessage = 'Name must contain only letters and spaces';
       } else if (!validateEmail(email)) {
           isEmailError = true;
           alertMessage = 'Invalid email address';
       } else if (!validatePassword(password)) {
           isPasswordError = true;
           alertMessage = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
       } else if (password !== confirmPassword) {
           isPasswordMatchError = true;
           alertMessage = 'Passwords do not match';
       } else {
           // Check if email already exists
           const emailCheckResponse = await fetch('/api/register/checkEmail', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({ email })
           });

           const emailCheckData = await emailCheckResponse.json();

           if (emailCheckData.exists) {
               isEmailError = true;
               alertMessage = 'Email already exists';
           } else {
               // Proceed with registration
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
                   alertMessage = 'Registration successful';
               } else {
                   alertMessage = 'Registration failed';
               }
           }
       }

       alertMessageDisplay = true;
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
        <img src="/assets/logo.svg" alt="Logo" class="w-10 h-10 mr-" />
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
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round">
                  <circle cx="12" cy="8" r="5"/>
                  <path d="M20 21a8 8 0 0 0-16 0"/>
                </svg>
                <input type="text" class="grow" placeholder="Full Name" bind:value={name} on:input={handleInput}/>
              </label>
            </div>
            <div class="mb-4">
              <label class="input input-bordered {isEmailError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7.175q.125 0 .263-.038t.262-.112L19.6 8.25q.2-.125.3-.312t.1-.413q0-.5-.425-.75T18.7 6.8L12 11L5.3 6.8q-.45-.275-.875-.012T4 7.525q0 .25.1.438t.3.287l7.075 4.425q.125.075.263.113t.262.037"/>
                </svg>
                <input type="text" class="grow" placeholder="Email" bind:value={email} on:input={handleInput} />
              </label>
            </div>
            <div class="mb-4">
              <label class="input input-bordered {isPasswordError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M2 19v-2h20v2zm1.15-6.05l-1.3-.75l.85-1.5H1V9.2h1.7l-.85-1.45L3.15 7L4 8.45L4.85 7l1.3.75L5.3 9.2H7v1.5H5.3l.85 1.5l-1.3.75l-.85-1.5zm8 0l-1.3-.75l.85-1.5H9V9.2h1.7l-.85-1.45l1.3-.75l.85 1.45l.85-1.45l1.3.75l-.85 1.45H15v1.5h-1.7l.85 1.5l-1.3.75l-.85-1.5zm8 0l-1.3-.75l.85-1.5H17V9.2h1.7l-.85-1.45l1.3-.75l.85 1.45l.85-1.45l1.3.75l-.85 1.45H23v1.5h-1.7l.85 1.5l-1.3.75l-.85-1.5z"/>
                </svg>
                <input type="password" class="grow" placeholder="Password" bind:value={password} on:input={handleInput} />
              </label>
            </div>
            <div class="mb-6">
              <label class="input input-bordered {isPasswordMatchError ? 'input-error animate-pulse' : ''} flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M2 19v-2h20v2zm1.15-6.05l-1.3-.75l.85-1.5H1V9.2h1.7l-.85-1.45L3.15 7L4 8.45L4.85 7l1.3.75L5.3 9.2H7v1.5H5.3l.85 1.5l-1.3.75l-.85-1.5zm8 0l-1.3-.75l.85-1.5H9V9.2h1.7l-.85-1.45l1.3-.75l.85 1.45l.85-1.45l1.3.75l-.85 1.45H15v1.5h-1.7l.85 1.5l-1.3.75l-.85-1.5zm8 0l-1.3-.75l.85-1.5H17V9.2h1.7l-.85-1.45l1.3-.75l.85 1.45l.85-1.45l1.3.75l-.85 1.45H23v1.5h-1.7l.85 1.5l-1.3.75l-.85-1.5z"/>
                </svg>
                <input type="password" class="grow" placeholder="Confirm Password" bind:value={confirmPassword} on:input={handleInput} />
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