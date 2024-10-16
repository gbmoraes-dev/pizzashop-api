import Elysia, { t } from 'elysia'

import { eq } from 'drizzle-orm'

import { db } from '@/db/connection'

import { users } from '@/db/schemas'

import { authenticate } from '@/http/authenticate'

export const updateUser = new Elysia().use(authenticate).put(
	'/me',
	async ({ getCurrentUser, body, set }) => {
		const { sub: userId } = await getCurrentUser()

		const { name, email, phone } = body

		await db
			.update(users)
			.set({ name, email, phone })
			.where(eq(users.id, userId))

		set.status = 204
	},
	{
		body: t.Object({
			name: t.Optional(t.String()),
			email: t.Optional(t.String({ format: 'email' })),
			phone: t.Optional(t.String()),
		}),
	},
)
