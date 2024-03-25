<script>
	import '../app.pcss'
	import Header from './header.svelte'
</script>

<main class="h-screen w-screen px-5">
	<Header />
	<slot />
</main>

<svelte:head>
	<title>Lucia V3 Test</title>
</svelte:head>
