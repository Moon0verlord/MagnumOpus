<script lang="ts">
  import { onMount } from 'svelte';
  import oktaAuth from '../../oktaAuth';


  //UNCOMMENT THIS TO MAKE IT WORK WIHTOUT OKTA!!
  // onMount(async () => {
  //   window.location.href = '/home';
  // });



// This function should be triggered upon loading the callback URL
onMount(async () => {
    console.log('onMount called, checking if it is a login redirect...');
    if (oktaAuth.isLoginRedirect()) {
        console.log('It is a login redirect, handling the redirect...');
        try {
            await oktaAuth.handleRedirect(); // comment this line to make it work ig
            console.log('Redirect handled, navigating to /home...');
            window.location.href = '/home';
        } catch (error) {
            console.error('Error during redirect handling:', error);
            window.location.href = '/error';
        }
    } else {
        console.log('It is not a login redirect.');
    }
});

</script>
