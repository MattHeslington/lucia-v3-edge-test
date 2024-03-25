<script>
	import { userStore } from '$lib/store.js'
	import { page } from '$app/stores'
	let user
	userStore.subscribe((value) => {
		user = value
	})
	$: {
		console.log('header user', user)
	}

	$: console.log('header page', $page)
</script>

<nav class="flex h-20 w-full items-center justify-between">
	<a href="/">
		<h1>Logo</h1>
	</a>
	<div class="flex items-center justify-end space-x-5">
		<a href="/protected">protected</a>
		{#if !$page.data.userid}
			<a href="/login">login</a>
		{:else}
			<div class="flex items-center justify-end space-x-5">
				<img src={$page.data.avatar} alt="" class="w-10 rounded-full" />
				<div>{$page.data.username}</div>
				<a href="/logout">logout</a>
			</div>
		{/if}
	</div>
</nav>
