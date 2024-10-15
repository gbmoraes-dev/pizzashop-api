import Elysia from 'elysia'

import { authenticate } from '@/http/authenticate'

import { db } from '@/db/connection'

export const getManagedRestaurant = new Elysia()
	.use(authenticate)
	.get('/managed-restaurant', async ({ getCurrentUser }) => {
		const { restaurantId } = await getCurrentUser()

		if (!restaurantId) {
			throw new Error('User is not a manager.')
		}

		const managedRestaurant = await db.query.restaurants.findFirst({
			where(fields, { eq }) {
				return eq(fields.id, restaurantId)
			},
		})

		return managedRestaurant
	})
