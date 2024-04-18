<script>
	import Header from './Header.svelte';
	import './styles.css';
	import { page } from '$app/stores';
	
</script>

<div class="app items-center">
	{#if $page.url.pathname !== '/'}
		<Header />
	{/if}
	<main class="">
		<slot />
	</main>
	
</div>


