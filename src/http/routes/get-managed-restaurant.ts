import Elysia from 'elysia'

import { db } from '@/db/connection'

import { errors } from '@/http/errors'

import { authenticate } from '@/http/authenticate'

import { NotAManagerError } from '@/http/errors/not-a-manager-error'

export const getManagedRestaurant = new Elysia()
	.use(errors)
	.use(authenticate)
	.get('/managed-restaurant', async ({ getCurrentUser }) => {
		const { restaurantId } = await getCurrentUser()

		if (!restaurantId) {
			throw new NotAManagerError()
		}

		const managedRestaurant = await db.query.restaurants.findFirst({
			where(fields, { eq }) {
				return eq(fields.id, restaurantId)
			},
		})

		return managedRestaurant
	})
