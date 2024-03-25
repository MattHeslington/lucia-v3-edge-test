import { sql } from './db.js'
import { Lucia } from 'lucia'
import { GitHub } from 'arctic'
import { NeonHTTPAdapter } from '@lucia-auth/adapter-postgresql'
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private'
import { dev } from '$app/environment'

const adapter = new NeonHTTPAdapter(sql, {
	user: 'users',
	session: 'sessions'
	// RENAME THESE
})

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			githubId: attributes.github_id,
			username: attributes.username,
			avatar: attributes.avatar
		}
	}
})

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
