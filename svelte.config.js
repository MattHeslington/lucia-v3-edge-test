import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import adapter from '@sveltejs/adapter-cloudflare'

const config = {
	kit: {
		adapter: adapter()
	},

	preprocess: [vitePreprocess({})]
}

export default config
