<script>
	import { Router, Route } from "svelte-routing";
	import HomePage from "./pages/HomePage.svelte"
</script>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>


<Router>
	<main>
		<Route path="/" component={HomePage} />
	</main>
</Router>