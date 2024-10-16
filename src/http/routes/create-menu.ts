import Elysia, { t } from 'elysia'

import { db } from '@/db/connection'

import { products } from '@/db/schemas'

import { authenticate } from '@/http/authenticate'

const productSchema = t.Object({
	id: t.Optional(t.String()),
	name: t.String(),
	description: t.Optional(t.String()),
	price: t.Number({ minimum: 0 }),
})

export const createMenu = new Elysia().use(authenticate).post(
	'/menu',
	async ({ getManagedRestaurantId, body, set }) => {
		const restaurantId = await getManagedRestaurantId()

		const { newProducts } = body

		if (newProducts.length) {
			await db.insert(products).values(
				newProducts.map((product) => {
					return {
						name: product.name,
						description: product.description,
						priceInCents: product.price * 100,
						restaurantId,
					}
				}),
			)
		}

		set.status = 204
	},
	{
		body: t.Object({
			newProducts: t.Array(productSchema),
		}),
	},
)
