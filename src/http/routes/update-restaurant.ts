import Elysia, { t } from 'elysia'

import { eq } from 'drizzle-orm'

import { db } from '@/db/connection'

import { restaurants } from '@/db/schemas'

import { authenticate } from '@/http/authenticate'

export const updateRestaurant = new Elysia().use(authenticate).put(
	'/restaurant',
	async ({ getManagedRestaurantId, body, set }) => {
		const restaurantId = await getManagedRestaurantId()

		const { name, description } = body

		await db
			.update(restaurants)
			.set({
				name,
				description,
			})
			.where(eq(restaurants.id, restaurantId))

		set.status = 204
	},
	{
		body: t.Object({
			name: t.Optional(t.String()),
			description: t.Optional(t.String()),
		}),
	},
)
