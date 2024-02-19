<script>
	import Photo from './logo.png'
	import Counter from './Counter.svelte';
	import Login from "./login.svelte";
  </script>
  
  <svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
  </svelte:head>
  
  <section>
	<div class="welcome">
		<img alt="Schuberg" src={Photo}>
	</div>	
	<h1>
	  <Login/>
	</h1>
  </section>
  
  <style>
	section {
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  flex: 0.6;
	}
  
	h1 {
	  width: 100%;
	}
  
	.welcome {
	  display: block;
	  position: relative;

	  width: 100%;
	  height: 0;
	  padding: 0 0 calc(100% * 495 / 2048) 0;
	}
  
	.welcome img {
	  position: absolute;
	  width: 80%;
	  height: 100%;
	  top: 0;
	  display: block;
	  padding-left: 20%;
	  padding-right: 0%;
	  padding-bottom: 10%;
	}
  </style>
  