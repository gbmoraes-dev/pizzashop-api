import Elysia, { t } from 'elysia'

import { db } from '@/db/connection'

import { z } from 'zod'

export const getMenu = new Elysia().get(
	'/restaurants/:restaurantId/menu',
	async ({ params, query }) => {
		const { restaurantId } = params

		const { pageIndex } = z
			.object({
				pageIndex: z.coerce.number().default(0),
			})
			.parse(query)

		const menu = await db.query.products.findMany({
			offset: pageIndex * 10,
			limit: 10,
			where(fields, { eq }) {
				return eq(fields.restaurantId, restaurantId)
			},
		})

		return menu
	},
	{
		params: t.Object({
			restaurantId: t.String(),
		}),
		query: t.Object({
			pageIndex: t.Numeric({ minimum: 0 }),
		}),
	},
)
