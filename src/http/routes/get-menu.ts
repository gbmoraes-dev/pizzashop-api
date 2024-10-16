import Elysia from 'elysia'

import { db } from '@/db/connection'

import { authenticate } from '@/http/authenticate'

export const getMenu = new Elysia()
	.use(authenticate)
	.get('/menu', async ({ getManagedRestaurantId }) => {
		const restaurantId = await getManagedRestaurantId()

		const menu = await db.query.products.findMany({
			where(fields, { eq }) {
				return eq(fields.restaurantId, restaurantId)
			},
		})

		return menu
	})
