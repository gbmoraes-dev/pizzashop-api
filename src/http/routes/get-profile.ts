import Elysia from 'elysia'

import { db } from '@/db/connection'

import { errors } from '@/http/errors'

import { authenticate } from '@/http/authenticate'

import { UnauthorizedError } from '@/http/errors/unauthorized-error'

export const getProfile = new Elysia()
	.use(errors)
	.use(authenticate)
	.get('/me', async ({ getCurrentUser }) => {
		const { sub: userId } = await getCurrentUser()

		const user = await db.query.users.findFirst({
			where(fields, { eq }) {
				return eq(fields.id, userId)
			},
		})

		if (!user) {
			throw new UnauthorizedError()
		}

		return user
	})
