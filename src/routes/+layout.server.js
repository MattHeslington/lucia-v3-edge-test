export const load = async (event) => {
	return {
		userid: event.locals.user?.id,
		username: event.locals.user?.username,
		avatar: event.locals.user?.avatar
	}
}
