import Elysia, { t } from 'elysia'

import { db } from '@/db/connection'

import { restaurants, users } from '@/db/schemas'

export const registerRestaurant = new Elysia().post(
	'/restaurants',
	async ({ body, set }) => {
		const {
			restaurantName,
			restaurantDescription,
			managerName,
			managerEmail,
			managerPhone,
		} = body

		const [manager] = await db
			.insert(users)
			.values({
				name: managerName,
				email: managerEmail,
				phone: managerPhone,
				role: 'manager',
			})
			.returning({ id: users.id })

		await db.insert(restaurants).values({
			name: restaurantName,
			description: restaurantDescription,
			managerId: manager.id,
		})

		set.status = 204
	},
	{
		body: t.Object({
			restaurantName: t.String(),
			restaurantDescription: t.String(),
			managerName: t.String(),
			managerEmail: t.String({ format: 'email' }),
			managerPhone: t.String(),
		}),
	},
)
