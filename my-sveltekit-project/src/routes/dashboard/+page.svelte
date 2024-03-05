<script>
import Photo from "../logo.png";
import map from "../../lib/Map.png"

</script>
<style>
	
</style>

<svelte:head>
	<title>DashBoard</title>
	<meta name="Dashboard" content="About this app" />
</svelte:head>
<div class="dasboard-main">
<div class="drawer">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col border-b-2 border-gray-400">
		<!-- Navbar -->
		<div class="w-full navbar bg-base-100 ">
			<div class="flex-none lg:hidden bg-white">
				<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost ">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current "><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
				</label>
			</div>
			<img class="img-navbar" alt="Schuberg philis" src={Photo}>
			<div class="flex-none hidden lg:block ">
				<ul class="menu menu-horizontal text-white">
					<!-- Navbar menu content here -->
					<li><a>Overview</a></li>
					<li><a>Settings</a></li>
					<li><a>Profile</a></li>
					<li><a>Notifications</a></li>
					<li><a href="/">Logout</a></li>
				</ul>
			</div>
		</div>
		
	</div>
	<div class="drawer-side ">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu p-4 w-55 min-h-full bg-base-200 text-white">
			<!-- Sidebar content here -->
			<li><a>Overview</a></li>
			<li><a>Settings</a></li>
			<li><a>Profile</a></li>
			<li><a>Notifications</a></li>
			<li><a href="/">Logout</a></li>
		</ul>
	</div>
</div>

<div class="dashboard bg-base-100 text-white flex flex-column z-1">
	<div class="overflow-x-auto">
		<table class="table">
			<!-- head -->
			<thead>
			<tr>
				<th></th>
				<th>Name</th>
				<th>Job</th>
				<th>Favorite Color</th>
			</tr>
			</thead>
			<tbody>
			<!-- row 1 -->
			<tr>
				<th>1</th>
				<td>Cy Ganderton</td>
				<td>Quality Control Specialist</td>
				<td>Blue</td>
			</tr>
			<!-- row 2 -->
			<tr class="hover">
				<th>2</th>
				<td>Hart Hagerty</td>
				<td>Desktop Support Technician</td>
				<td>Purple</td>
			</tr>
			<!-- row 3 -->
			<tr>
				<th>3</th>
				<td>Brice Swyre</td>
				<td>Tax Accountant</td>
				<td>Red</td>
			</tr>
			</tbody>
		</table>
	</div>
	<div class="item">
		<img class="Map" src={map} alt="Map">
		<p class="caption">Click to view Map</p>
	</div>
</div>
</div>