import { lucia } from '$lib/auth'
import { userStore } from '$lib/store.js'

export const handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName)
	if (!sessionId) {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	const { session, user } = await lucia.validateSession(sessionId)
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id)
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		})
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie()
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		})
		userStore.set(null)
	}
	event.locals.user = user
	event.locals.session = session
	userStore.set(user)
	console.log('hooks server locals', event.locals.user)
	return resolve(event)
}
