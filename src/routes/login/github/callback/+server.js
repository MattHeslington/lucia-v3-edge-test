import { OAuth2RequestError } from 'arctic'
import { github, lucia } from '$lib/auth'
import { generateId } from 'lucia'
import { sql } from '$lib/db'

export async function GET(event) {
	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')
	const storedState = event.cookies.get('github_oauth_state') ?? null
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		})
	}

	try {
		const tokens = await github.validateAuthorizationCode(code)
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		})
		const githubUser = await githubUserResponse.json()
		const existingUser = await sql('SELECT * FROM users WHERE github_id = $1', [githubUser.id])
		console.log('existingUser', existingUser)
		if (existingUser.length > 0) {
			const session = await lucia.createSession(existingUser[0].id, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			})
		} else {
			console.log('new user')
			const userId = generateId(15)
			await sql('INSERT INTO users (id, github_id, username, avatar) VALUES ($1, $2, $3, $4)', [
				userId,
				githubUser.id,
				githubUser.login,
				githubUser.avatar_url
			])
			const session = await lucia.createSession(userId, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			})
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		})
	} catch (e) {
		if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
			// invalid code
			return new Response(null, {
				status: 400
			})
		}
		return new Response(null, {
			status: 500
		})
	}
}
