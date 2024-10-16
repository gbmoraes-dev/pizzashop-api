import Elysia from 'elysia'

import { db } from '@/db/connection'

import { errors } from '@/http/errors'

import { authenticate } from '@/http/authenticate'

import { ContentNotFoundError } from '../errors/content-not-found-error'

export const getManagedRestaurant = new Elysia()
	.use(errors)
	.use(authenticate)
	.get('/managed-restaurant', async ({ getManagedRestaurantId }) => {
		const restaurantId = await getManagedRestaurantId()

		const managedRestaurant = await db.query.restaurants.findFirst({
			where(fields, { eq }) {
				return eq(fields.id, restaurantId)
			},
		})

		if (!managedRestaurant) {
			throw new ContentNotFoundError()
		}

		return managedRestaurant
	})
