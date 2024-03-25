<script lang="ts">
    let isLoading = false;
    let email = '';
    let alertMessageDisplay = true;
    let alertMessage = 'Coming soon!';
</script>

{#if alertMessageDisplay}
    <div role="alert"
         class="alert animate-slide-down flex w-11/12 mt-2.5 lg:mt-2.5 mx-auto absolute top-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{alertMessage}</span>
    </div>
{/if}

<!-- Register -->
<div class="flex items-center justify-center h-screen">
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <h2 class="card-title">Forgot Password</h2>
            <label class="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                     class="w-4 h-4 opacity-70">
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                </svg>
                <input type="email" class="grow" placeholder="Email" bind:value={email}
                       on:input={() => alertMessageDisplay = false} disabled/>
            </label>
            <button class="btn btn-block">
                    Send Email
            </button>
            <div class="label">
                <span class="label-text-alt">
                    <a href="/" class="link link-hover">Login</a>
                </span>
            </div>
        </div>
    </div>
</div>