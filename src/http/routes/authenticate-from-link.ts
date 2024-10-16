import Elysia, { t } from 'elysia'

import { eq } from 'drizzle-orm'

import dayjs from 'dayjs'

import { db } from '@/db/connection'

import { authLinks } from '@/db/schemas'

import { errors } from '@/http/errors'

import { authenticate } from '@/http/authenticate'

import { ContentNotFoundError } from '@/http/errors/not-found-error'
import { LinkExpiredError } from '@/http/errors/link-expired-error'

export const authenticateFromLink = new Elysia()
	.use(errors)
	.use(authenticate)
	.get(
		'/auth-link/authenticate',
		async ({ query, signUser, redirect }) => {
			const { code, redirect_url } = query

			const authLinkFromCode = await db.query.authLinks.findFirst({
				where(fields, { eq }) {
					return eq(fields.code, code)
				},
			})

			if (!authLinkFromCode) {
				throw new ContentNotFoundError()
			}

			if (dayjs().diff(authLinkFromCode.createdAt, 'days') > 7) {
				throw new LinkExpiredError()
			}

			const managedRestaurant = await db.query.restaurants.findFirst({
				where(fields, { eq }) {
					return eq(fields.managerId, authLinkFromCode.userId)
				},
			})

			await signUser({
				sub: authLinkFromCode.userId,
				restaurantId: managedRestaurant?.id,
			})

			await db.delete(authLinks).where(eq(authLinks.code, code))

			// return redirect(redirect_url)
		},
		{
			query: t.Object({
				code: t.String(),
				redirect_url: t.String(),
			}),
		},
	)
