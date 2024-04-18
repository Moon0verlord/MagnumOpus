<script lang="ts">
	import Logo from '$lib/images/SchubergLogo.png';
	import {goto} from "$app/navigation";
	interface LoginForm {
		email: HTMLInputElement;
		password: HTMLInputElement;
	}
	const handleClick =(event:SubmitEvent) =>{
		const curUser = {
			email: 'e@a.com',
			password: 'abc123'
		}
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const emailValue = form.elements?.['email']?.value;
		const passwordValue = form.elements?.['password']?.value;
		if(emailValue === curUser.email && passwordValue === curUser.password) {
			goto(`/about`, {replaceState:true});
		} else {
			console.log('Invalid credentials');
		}
		
	}
</script>


<section class="h-screen flex ; flex-col items-center justify-center px-6 py-12 lg:px-8 ">
	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white rounded-md">
		<img src={Logo} alt="Logo" class="w-48 h-32 mx-auto"  />
		<form class="space-y-6" action="#" on:submit={handleClick}>
			<div>
				<label for="email" class="m-3 block text-sm font-medium leading-6 text-gray-900">Email address</label>
				<div class="m-3">
					<input id="email" name="email" type="email" autocomplete="email" required class="block w-full 
					rounded-md border-0 py-1 text-white-900 shadow-sm ring-1 ring-inset 
					ring-gray-300 placeholder:text-white-900 focus:ring-2 
					focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
				</div>
			</div>
			<div>
				<div class="flex m-3 items-center justify-between">
					<label for="password" class=" block text-sm font-medium leading-6 text-gray-900">Password</label>
					<div class="text-sm">
						<a href="#" class="font-semibold text-indigo-600 hover:text-custom-blue-500">Forgot password?</a>
					</div>
				</div>
				<div class="m-3">
					<input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 
					py-1 text-white-900 shadow-sm ring-1 ring-inset 
					ring-gray-300 placeholder:text-white-900 
					focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
				</div>
			</div>

			<div class="m-12">
				<button type="submit" class="flex w-full justify-center rounded-md bg-custom-blue  
				px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:text-indigo-600 
				focus-visible:outline focus-visible:outline-2 
				focus-visible:outline-offset-2 focus-visible:outline-custom-blue">Sign in</button>
			</div>
		</form>

		<p class="mt-10 text-center text-sm text-gray-500">
			Not a member?
			<a href="#" class="font-semibold 
			leading-6 text-custom-blue
			hover:text-indigo-600"> Register now !</a>
		</p>
		
	</div>
	<div class="quotes text-blue-300 flex flex-col items-center  justify-center m-3 text-2xl">
		<br>
		<h1>Quote:</h1>
		<hr class="w-80 m-1">
		<p class="italic">"The Pope?"</p>
		<p class="italic">"How many divisions has he got?"</p>
		<hr class="w-80 m-1">
		<p class="italic"> - Joseph stalin</p>
	</div>
</section>
