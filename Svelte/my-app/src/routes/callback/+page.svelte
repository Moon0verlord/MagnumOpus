<script lang="ts">
  import { onMount } from 'svelte';
  import oktaAuth from '../../oktaAuth';


  //UNCOMMENT THIS TO MAKE IT WORK WIHTOUT OKTA!!
  // onMount(async () => {
  //   window.location.href = '/home';
  // });


// This function should be triggered upon loading the callback URL
onMount(async () => {
  
    // This function will execute if there's a "code" parameter in the URL, indicating an Okta redirect

    //make this !oktaAuth.isLoginRedirect() to make it work!!!!!
    if (oktaAuth.isLoginRedirect()) {
      try {
        // Parses tokens from the URL, automatically handles exchange of the code for tokens
        await oktaAuth.handleRedirect(); // This method should handle everything related to redirect
        window.location.href = '/home'; // Navigate to home after successful login
      } catch (error) {
        console.error('Error during redirect handling:', error);
        window.location.href = '/error'; // Navigate to an error page on failure
      }
    }
  });


</script>
