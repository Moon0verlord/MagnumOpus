<script lang="ts">
  import { onMount } from 'svelte';
  import oktaAuth from '../../oktaAuth';


// This function should be triggered upon loading the callback URL
  async function handleCallback() {
    try {
      const { tokens } = await oktaAuth.token.parseFromUrl();
      oktaAuth.tokenManager.setTokens(tokens);
      window.location.href = '/home';
    } catch (error) {
      console.error('Error handling callback:', error);
      localStorage.setItem('error', 'Error during redirect handling: ' + error);
      window.location.href = '/error';
    }
  }

  if (oktaAuth.isLoginRedirect()) {
    handleCallback();
  }

</script>
