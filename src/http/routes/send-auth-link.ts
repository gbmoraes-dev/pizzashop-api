import Elysia, { t } from 'elysia'

import { createId } from '@paralleldrive/cuid2'

import { env } from '@/env'

import { db } from '@/db/connection'

import { authLinks } from '@/db/schemas'

export const sendAuthLink = new Elysia().post(
	'/authenticate',
	async ({ body }) => {
		const { email } = body

		const user = await db.query.users.findFirst({
			where(fields, { eq }) {
				return eq(fields.email, email)
			},
		})

		if (!user) {
			throw new Error('User not found.')
		}

		const code = createId()

		await db.insert(authLinks).values({
			userId: user.id,
			code: code,
		})

		const authLink = new URL('/auth-link/authenticate', env.API_BASE_URL)

		authLink.searchParams.set('code', code)
		authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

		console.log(authLink.toString())
	},
	{
		body: t.Object({
			email: t.String({ format: 'email' }),
		}),
	},
)
