import { redirect } from '@sveltejs/kit'

export const load = async (event) => {
	if (!event.locals.user) redirect(302, '/login')

	return {
		username: event.locals.user.username
	}
}
