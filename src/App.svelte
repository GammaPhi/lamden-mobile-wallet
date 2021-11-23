<script>
	import { Router, Route } from "svelte-routing";
	import HomePage from "./pages/HomePage.svelte"
	import NavBar from "./components/Nav/NavigationBar.svelte";
	import { onMount } from 'svelte'


	onMount(() => {
		unregisterOldServiceWorkers()
	})

	function unregisterOldServiceWorkers(){
		if (typeof navigator === "undefined") return
		if (typeof navigator.serviceWorker === "undefined") return

		navigator.serviceWorker.getRegistrations()
		.then(registrations => {
			for(let registration of registrations) { 
				registration.unregister(); 
			}
			if (registrations.length > 0) window.location.reload()
		})
	}
</script>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>


<Router>
	<NavBar />
	<main>
		<Route path="/" component={HomePage} />
		<Route path="/send" component={HomePage} />
		<Route path="/settings" component={HomePage} />
	</main>
</Router>