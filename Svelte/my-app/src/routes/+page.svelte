<script lang="ts">
  import { mobile } from "./mobile/mobile";
  import { userId } from "../store";
  import oktaAuth from "../oktaAuth";

  let isLoading = false;
  let email = "";
  let password = "";
  let isEmailError = false;
  let isPasswordError = false;
  let alertMessageDisplay = false;
  let alertMessage = "";

  $: isMobile = $mobile;

  userId.set(null);
  document.cookie = `userId=Expired; SameSite=None; path=/; Secure`;

  // Okta Login function. works fine
  async function handleOktaLogin() {
    try {
      await oktaAuth.signInWithRedirect();
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  async function handleLoginKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (email === "" || password === "") {
        return;
      }
      await handleLogin();
    }
  }

  async function handleLogin() {
    isLoading = true;

    if (email === "" || password === "") {
      if (email === "") {
        isEmailError = true;
      }
      if (password === "") {
        isPasswordError = true;
      }
      alertMessageDisplay = true;
      alertMessage = "Please fill in all fields";
      isLoading = false;
      setTimeout(() => {
        alertMessageDisplay = false;
      }, 5000);
      return;
    }

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password,
      }),
    });

    isLoading = false;

    if (response.status === 201) {
      const data = await response.json();
      userId.set(data.uuid);
      document.cookie = `userId=${data.uuid}; SameSite=None; path=/; Secure`;
      window.location.href = "/home";
    } else {
      alertMessageDisplay = true;
      alertMessage = "Invalid email or password";
      setTimeout(() => {
        alertMessageDisplay = false;
      }, 5000);
      email = "";
      password = "";
    }
  }

  function handleInput() {
    if (email !== "") {
      isEmailError = false;
    }
    if (password !== "") {
      isPasswordError = false;
    }

    if (alertMessage === "Invalid email or password") {
      alertMessageDisplay = false;
    }

    if (alertMessageDisplay && email !== "" && password !== "") {
      alertMessageDisplay = false;
    }
  }
</script>

{#if alertMessageDisplay}
  <div
    role="alert"
    class="alert alert-error animate-slide-down flex w-1/2 mt-2.5 lg:mt-2.5 mx-auto absolute top-0 left-0 right-0"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <span>{alertMessage}</span>
  </div>
{/if}

{#if isMobile}
  <div class="flex items-center justify-center h-screen">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Login</h2>
        <label
          class="input input-bordered {isEmailError
            ? 'input-error animate-pulse'
            : ''} flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-4 h-4 opacity-70"
          >
            <path
              d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
              d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
          </svg>
          <input
            type="text"
            class="grow"
            placeholder="Email"
            bind:value={email}
            on:keydown={handleLoginKey}
            on:input={handleInput}
          />
        </label>
        <label
          class="input input-bordered {isPasswordError
            ? 'input-error animate-pulse'
            : ''} flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-4 h-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd"
            />
          </svg>
          <input
            type="password"
            class="grow"
            placeholder="Password"
            bind:value={password}
            on:keydown={handleLoginKey}
            on:input={handleInput}
          />
        </label>
        <button class="btn btn-block" on:click={handleLogin}>
          {#if isLoading}
            <span class="loading loading-spinner"></span>
          {:else}
            Login
          {/if}
        </button>
        <div class="label">
          <span class="label-text-alt">
            <a href="/register" class="link link-hover">Register</a>
          </span>
        </div>
        <div class="divider -mt-1">OR</div>
        <button
          on:click={handleOktaLogin}
          class="btn btn-neutral w-full"
          style="display: flex; align-items: center; justify-content: center;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 63 63"
            fill="currentColor"
            style="margin-right: 8px;"
          >
            <path
              d="M34.6,0.4l-1.3,16c-0.6-0.1-1.2-0.1-1.9-0.1c-0.8,0-1.6,0.1-2.3,0.2l-0.7-7.7c0-0.2,0.2-0.5,0.4-0.5h1.3
          l-0.6-7.8c0-0.2,0.2-0.5,0.4-0.5h4.3C34.5,0,34.7,0.2,34.6,0.4L34.6,0.4L34.6,0.4z M23.8,1.2c-0.1-0.2-0.3-0.4-0.5-0.3l-4,1.5
          C19,2.5,18.9,2.8,19,3l3.3,7.1l-1.2,0.5c-0.2,0.1-0.3,0.3-0.2,0.6l3.3,7c1.2-0.7,2.5-1.2,3.9-1.5L23.8,1.2L23.8,1.2z M14,5.7
          l9.3,13.1c-1.2,0.8-2.2,1.7-3.1,2.7L14.5,16c-0.2-0.2-0.2-0.5,0-0.6l1-0.8L10,9c-0.2-0.2-0.2-0.5,0-0.6l3.3-2.7
          C13.5,5.4,13.8,5.5,14,5.7L14,5.7z M6.2,13.2c-0.2-0.1-0.5-0.1-0.6,0.1l-2.1,3.7c-0.1,0.2,0,0.5,0.2,0.6l7.1,3.4l-0.7,1.1
          c-0.1,0.2,0,0.5,0.2,0.6l7.1,3.2c0.5-1.3,1.2-2.5,2-3.6L6.2,13.2z M0.9,23.3c0-0.2,0.3-0.4,0.5-0.3l15.5,4
          c-0.4,1.3-0.6,2.7-0.7,4.1l-7.8-0.6c-0.2,0-0.4-0.2-0.4-0.5l0.2-1.3L0.6,28c-0.2,0-0.4-0.2-0.4-0.5L0.9,23.3L0.9,23.3L0.9,23.3z
           M0.4,33.8C0.1,33.8,0,34,0,34.3l0.8,4.2c0,0.2,0.3,0.4,0.5,0.3l7.6-2l0.2,1.3c0,0.2,0.3,0.4,0.5,0.3l7.5-2.1
          c-0.4-1.3-0.7-2.7-0.8-4.1L0.4,33.8L0.4,33.8z M2.9,44.9c-0.1-0.2,0-0.5,0.2-0.6l14.5-6.9c0.5,1.3,1.3,2.5,2.2,3.6l-6.3,4.5
          c-0.2,0.1-0.5,0.1-0.6-0.1L12,44.3l-6.5,4.5c-0.2,0.1-0.5,0.1-0.6-0.1L2.9,44.9L2.9,44.9z M20.4,41.9L9.1,53.3
          c-0.2,0.2-0.2,0.5,0,0.6l3.3,2.7c0.2,0.2,0.5,0.1,0.6-0.1l4.6-6.4l1,0.9c0.2,0.2,0.5,0.1,0.6-0.1l4.4-6.4
          C22.4,43.8,21.3,42.9,20.4,41.9L20.4,41.9z M18.2,60.1c-0.2-0.1-0.3-0.3-0.2-0.6L24.6,45c1.2,0.6,2.6,1.1,3.9,1.4l-2,7.5
          c-0.1,0.2-0.3,0.4-0.5,0.3l-1.2-0.5l-2.1,7.6c-0.1,0.2-0.3,0.4-0.5,0.3L18.2,60.1L18.2,60.1L18.2,60.1z M29.6,46.6l-1.3,16
          c0,0.2,0.2,0.5,0.4,0.5H33c0.2,0,0.4-0.2,0.4-0.5l-0.6-7.8h1.3c0.2,0,0.4-0.2,0.4-0.5l-0.7-7.7c-0.8,0.1-1.5,0.2-2.3,0.2
          C30.9,46.7,30.2,46.7,29.6,46.6L29.6,46.6z M45.1,3.4c0.1-0.2,0-0.5-0.2-0.6l-4-1.5c-0.2-0.1-0.5,0.1-0.5,0.3l-2.1,7.6l-1.2-0.5
          c-0.2-0.1-0.5,0.1-0.5,0.3l-2,7.5c1.4,0.3,2.7,0.8,3.9,1.4L45.1,3.4L45.1,3.4z M53.9,9.7L42.6,21.1c-0.9-1-2-1.9-3.2-2.6l4.4-6.4
          c0.1-0.2,0.4-0.2,0.6-0.1l1,0.9l4.6-6.4c0.1-0.2,0.4-0.2,0.6-0.1l3.3,2.7C54,9.3,54,9.6,53.9,9.7L53.9,9.7z M59.9,18.7
          c0.2-0.1,0.3-0.4,0.2-0.6L58,14.4c-0.1-0.2-0.4-0.3-0.6-0.1l-6.5,4.5l-0.7-1.1c-0.1-0.2-0.4-0.3-0.6-0.1L43.3,22
          c0.9,1.1,1.6,2.3,2.2,3.6L59.9,18.7L59.9,18.7z M62.2,24.5l0.7,4.2c0,0.2-0.1,0.5-0.4,0.5l-15.9,1.5c-0.1-1.4-0.4-2.8-0.8-4.1
          l7.5-2.1c0.2-0.1,0.5,0.1,0.5,0.3l0.2,1.3l7.6-2C61.9,24.1,62.1,24.3,62.2,24.5L62.2,24.5L62.2,24.5z M61.5,40
          c0.2,0.1,0.5-0.1,0.5-0.3l0.7-4.2c0-0.2-0.1-0.5-0.4-0.5l-7.8-0.7l0.2-1.3c0-0.2-0.1-0.5-0.4-0.5l-7.8-0.6c0,1.4-0.3,2.8-0.7,4.1
          L61.5,40L61.5,40L61.5,40z M57.4,49.6c-0.1,0.2-0.4,0.3-0.6,0.1l-13.2-9.1c0.8-1.1,1.5-2.3,2-3.6l7.1,3.2c0.2,0.1,0.3,0.4,0.2,0.6
          L52.2,42l7.1,3.4c0.2,0.1,0.3,0.4,0.2,0.6L57.4,49.6C57.4,49.6,57.4,49.6,57.4,49.6z M39.7,44.2L49,57.3c0.1,0.2,0.4,0.2,0.6,0.1
          l3.3-2.7c0.2-0.2,0.2-0.4,0-0.6l-5.5-5.6l1-0.8c0.2-0.2,0.2-0.4,0-0.6l-5.5-5.5C42,42.6,40.9,43.5,39.7,44.2L39.7,44.2L39.7,44.2z
           M39.7,62c-0.2,0.1-0.5-0.1-0.5-0.3l-4.2-15.4c1.4-0.3,2.7-0.8,3.9-1.5l3.3,7c0.1,0.2,0,0.5-0.2,0.6l-1.2,0.5l3.3,7.1
          c0.1,0.2,0,0.5-0.2,0.6L39.7,62L39.7,62L39.7,62z">></path
            >
          </svg>
          Login with Okta
        </button>
      </div>
    </div>
  </div>
{:else}
  <div class="w-full grid min-h-screen grid-cols-2 xl:min-h-[100vh]">
    <!-- Blank section with logo and quote on the left -->
    <div
      class="flex flex-col justify-between p-12 bg-base-200 text-base-content"
    >
      <div class="relative z-20 flex items-center text-lg font-medium">
        <img src="/assets/logo.svg" alt="Logo" class="w-10 h-10 mr-" />
        <h2 class="text-2xl font-bold mb-1">Schuberg Philis</h2>
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;Sorry losers and haters, but my I.Q. is one of the highest
            and you all know it! Please don't feel so stupid or insecure, it's
            not your fault&rdquo;
          </p>
          <footer class="text-sm">
            —The 45th president of the United States
          </footer>
        </blockquote>
      </div>
    </div>

    <!-- Login section on the right -->
    <div
      class="flex items-center justify-center bg-base-100 py-12 lg:min-h-[600px] xl:min-h-[100vh]"
    >
      <div class="w-full max-w-md px-4">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-center mb-4">Login</h1>
          <form on:submit|preventDefault={handleLogin}>
            <div class="mb-4">
              <label
                class="input input-bordered {isEmailError
                  ? 'input-error animate-pulse'
                  : ''} flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7.175q.125 0 .263-.038t.262-.112L19.6 8.25q.2-.125.3-.312t.1-.413q0-.5-.425-.75T18.7 6.8L12 11L5.3 6.8q-.45-.275-.875-.012T4 7.525q0 .25.1.438t.3.287l7.075 4.425q.125.075.263.113t.262.037"
                  />
                </svg>
                <input
                  type="text"
                  class="grow"
                  placeholder="Email"
                  bind:value={email}
                  on:keydown={handleLoginKey}
                  on:input={handleInput}
                />
              </label>
            </div>
            <div class="mb-6">
              <label
                class="input input-bordered {isPasswordError
                  ? 'input-error animate-pulse'
                  : ''} flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M2 19v-2h20v2zm1.15-6.05l-1.3-.75l.85-1.5H1V9.2h1.7l-.85-1.45L3.15 7L4 8.45L4.85 7l1.3.75L5.3 9.2H7v1.5H5.3l.85 1.5l-1.3.75l-.85-1.5zm8 0l-1.3-.75l.85-1.5H9V9.2h1.7l-.85-1.45l1.3-.75l.85 1.45l.85-1.45l1.3.75l-.85 1.45H15v1.5h-1.7l.85 1.5l-1.3.75l-.85-1.5zm8 0l-1.3-.75l.85-1.5H17V9.2h1.7l-.85-1.45l1.3-.75l.85 1.45l.85-1.45l1.3.75l-.85 1.45H23v1.5h-1.7l.85 1.5l-1.3.75l-.85-1.5z"
                  />
                </svg>
                <input
                  type="password"
                  class="grow"
                  placeholder="Password"
                  bind:value={password}
                  on:keydown={handleLoginKey}
                  on:input={handleInput}
                />
              </label>
            </div>
            <button type="submit" class="btn btn-primary w-full">Login</button>
          </form>
        </div>
        <p class="text-center text-sm">
          Don't have an account?
          <a href="/register" class="link link-hover">Sign up</a>
        </p>
        <div class="divider">OR</div>
        <button
          on:click={handleOktaLogin}
          class="btn btn-neutral w-full"
          style="display: flex; align-items: center; justify-content: center;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 63 63"
            fill="currentColor"
            style="margin-right: 8px;"
          >
            <path
              d="M34.6,0.4l-1.3,16c-0.6-0.1-1.2-0.1-1.9-0.1c-0.8,0-1.6,0.1-2.3,0.2l-0.7-7.7c0-0.2,0.2-0.5,0.4-0.5h1.3
          l-0.6-7.8c0-0.2,0.2-0.5,0.4-0.5h4.3C34.5,0,34.7,0.2,34.6,0.4L34.6,0.4L34.6,0.4z M23.8,1.2c-0.1-0.2-0.3-0.4-0.5-0.3l-4,1.5
          C19,2.5,18.9,2.8,19,3l3.3,7.1l-1.2,0.5c-0.2,0.1-0.3,0.3-0.2,0.6l3.3,7c1.2-0.7,2.5-1.2,3.9-1.5L23.8,1.2L23.8,1.2z M14,5.7
          l9.3,13.1c-1.2,0.8-2.2,1.7-3.1,2.7L14.5,16c-0.2-0.2-0.2-0.5,0-0.6l1-0.8L10,9c-0.2-0.2-0.2-0.5,0-0.6l3.3-2.7
          C13.5,5.4,13.8,5.5,14,5.7L14,5.7z M6.2,13.2c-0.2-0.1-0.5-0.1-0.6,0.1l-2.1,3.7c-0.1,0.2,0,0.5,0.2,0.6l7.1,3.4l-0.7,1.1
          c-0.1,0.2,0,0.5,0.2,0.6l7.1,3.2c0.5-1.3,1.2-2.5,2-3.6L6.2,13.2z M0.9,23.3c0-0.2,0.3-0.4,0.5-0.3l15.5,4
          c-0.4,1.3-0.6,2.7-0.7,4.1l-7.8-0.6c-0.2,0-0.4-0.2-0.4-0.5l0.2-1.3L0.6,28c-0.2,0-0.4-0.2-0.4-0.5L0.9,23.3L0.9,23.3L0.9,23.3z
           M0.4,33.8C0.1,33.8,0,34,0,34.3l0.8,4.2c0,0.2,0.3,0.4,0.5,0.3l7.6-2l0.2,1.3c0,0.2,0.3,0.4,0.5,0.3l7.5-2.1
          c-0.4-1.3-0.7-2.7-0.8-4.1L0.4,33.8L0.4,33.8z M2.9,44.9c-0.1-0.2,0-0.5,0.2-0.6l14.5-6.9c0.5,1.3,1.3,2.5,2.2,3.6l-6.3,4.5
          c-0.2,0.1-0.5,0.1-0.6-0.1L12,44.3l-6.5,4.5c-0.2,0.1-0.5,0.1-0.6-0.1L2.9,44.9L2.9,44.9z M20.4,41.9L9.1,53.3
          c-0.2,0.2-0.2,0.5,0,0.6l3.3,2.7c0.2,0.2,0.5,0.1,0.6-0.1l4.6-6.4l1,0.9c0.2,0.2,0.5,0.1,0.6-0.1l4.4-6.4
          C22.4,43.8,21.3,42.9,20.4,41.9L20.4,41.9z M18.2,60.1c-0.2-0.1-0.3-0.3-0.2-0.6L24.6,45c1.2,0.6,2.6,1.1,3.9,1.4l-2,7.5
          c-0.1,0.2-0.3,0.4-0.5,0.3l-1.2-0.5l-2.1,7.6c-0.1,0.2-0.3,0.4-0.5,0.3L18.2,60.1L18.2,60.1L18.2,60.1z M29.6,46.6l-1.3,16
          c0,0.2,0.2,0.5,0.4,0.5H33c0.2,0,0.4-0.2,0.4-0.5l-0.6-7.8h1.3c0.2,0,0.4-0.2,0.4-0.5l-0.7-7.7c-0.8,0.1-1.5,0.2-2.3,0.2
          C30.9,46.7,30.2,46.7,29.6,46.6L29.6,46.6z M45.1,3.4c0.1-0.2,0-0.5-0.2-0.6l-4-1.5c-0.2-0.1-0.5,0.1-0.5,0.3l-2.1,7.6l-1.2-0.5
          c-0.2-0.1-0.5,0.1-0.5,0.3l-2,7.5c1.4,0.3,2.7,0.8,3.9,1.4L45.1,3.4L45.1,3.4z M53.9,9.7L42.6,21.1c-0.9-1-2-1.9-3.2-2.6l4.4-6.4
          c0.1-0.2,0.4-0.2,0.6-0.1l1,0.9l4.6-6.4c0.1-0.2,0.4-0.2,0.6-0.1l3.3,2.7C54,9.3,54,9.6,53.9,9.7L53.9,9.7z M59.9,18.7
          c0.2-0.1,0.3-0.4,0.2-0.6L58,14.4c-0.1-0.2-0.4-0.3-0.6-0.1l-6.5,4.5l-0.7-1.1c-0.1-0.2-0.4-0.3-0.6-0.1L43.3,22
          c0.9,1.1,1.6,2.3,2.2,3.6L59.9,18.7L59.9,18.7z M62.2,24.5l0.7,4.2c0,0.2-0.1,0.5-0.4,0.5l-15.9,1.5c-0.1-1.4-0.4-2.8-0.8-4.1
          l7.5-2.1c0.2-0.1,0.5,0.1,0.5,0.3l0.2,1.3l7.6-2C61.9,24.1,62.1,24.3,62.2,24.5L62.2,24.5L62.2,24.5z M61.5,40
          c0.2,0.1,0.5-0.1,0.5-0.3l0.7-4.2c0-0.2-0.1-0.5-0.4-0.5l-7.8-0.7l0.2-1.3c0-0.2-0.1-0.5-0.4-0.5l-7.8-0.6c0,1.4-0.3,2.8-0.7,4.1
          L61.5,40L61.5,40L61.5,40z M57.4,49.6c-0.1,0.2-0.4,0.3-0.6,0.1l-13.2-9.1c0.8-1.1,1.5-2.3,2-3.6l7.1,3.2c0.2,0.1,0.3,0.4,0.2,0.6
          L52.2,42l7.1,3.4c0.2,0.1,0.3,0.4,0.2,0.6L57.4,49.6C57.4,49.6,57.4,49.6,57.4,49.6z M39.7,44.2L49,57.3c0.1,0.2,0.4,0.2,0.6,0.1
          l3.3-2.7c0.2-0.2,0.2-0.4,0-0.6l-5.5-5.6l1-0.8c0.2-0.2,0.2-0.4,0-0.6l-5.5-5.5C42,42.6,40.9,43.5,39.7,44.2L39.7,44.2L39.7,44.2z
           M39.7,62c-0.2,0.1-0.5-0.1-0.5-0.3l-4.2-15.4c1.4-0.3,2.7-0.8,3.9-1.5l3.3,7c0.1,0.2,0,0.5-0.2,0.6l-1.2,0.5l3.3,7.1
          c0.1,0.2,0,0.5-0.2,0.6L39.7,62L39.7,62L39.7,62z">></path
            >
          </svg>
          Login with Okta
        </button>
      </div>
    </div>
  </div>
{/if}
