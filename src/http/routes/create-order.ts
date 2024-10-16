import Elysia, { t } from 'elysia'

import { db } from '@/db/connection'

import { orders, orderItems } from '@/db/schemas'

import { errors } from '@/http/errors'

import { authenticate } from '@/http/authenticate'

import { ProductNotAvailable } from '@/http/errors/product-not-available'

export const createOrder = new Elysia()
	.use(errors)
	.use(authenticate)
	.post(
		'/restaurants/:restaurantId/orders',
		async ({ getCurrentUser, params, body, set }) => {
			const { sub: customerId } = await getCurrentUser()

			const { restaurantId } = params

			const { items } = body

			const productsIds = items.map((item) => item.productId)

			const products = await db.query.products.findMany({
				where(fields, { and, inArray, eq }) {
					return and(
						eq(fields.restaurantId, restaurantId),
						inArray(fields.id, productsIds),
					)
				},
			})

			const orderProducts = items.map((item) => {
				const product = products.find(
					(product) => product.id === item.productId,
				)

				if (!product) {
					throw new ProductNotAvailable()
				}

				return {
					productId: item.productId,
					unitPriceInCents: product.priceInCents,
					quantity: item.quantity,
					subtotalInCents: item.quantity * product.priceInCents,
				}
			})

			const totalInCents = orderProducts.reduce((total, orderItem) => {
				return total + orderItem.subtotalInCents
			}, 0)

			await db.transaction(async (tx) => {
				const [order] = await tx
					.insert(orders)
					.values({
						totalInCents,
						customerId,
						restaurantId,
					})
					.returning({ id: orders.id })

				await tx.insert(orderItems).values(
					orderProducts.map((orderProduct) => {
						return {
							orderId: order.id,
							productId: orderProduct.productId,
							quantity: orderProduct.quantity,
							priceInCents: orderProduct.unitPriceInCents,
						}
					}),
				)
			})

			set.status = 201
		},
		{
			params: t.Object({
				restaurantId: t.String(),
			}),
			body: t.Object({
				items: t.Array(
					t.Object({
						productId: t.String(),
						quantity: t.Integer({ minimum: 1 }),
					}),
				),
			}),
		},
	)
