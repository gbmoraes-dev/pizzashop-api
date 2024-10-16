import Elysia, { type Static, t } from 'elysia'

import jwt from '@elysiajs/jwt'

import { env } from '@/env'

import { errors } from '@/http/errors'

import { UnauthorizedError } from '@/http/errors/unauthorized-error'
import { NotAManagerError } from '@/http/errors/not-a-manager-error'

const jwtPayloadSchema = t.Object({
	sub: t.String(),
	restaurantId: t.Optional(t.String()),
})

export const authenticate = new Elysia()
	.use(errors)
	.use(
		jwt({
			secret: env.JWT_SECRET,
			schema: jwtPayloadSchema,
		}),
	)
	.derive({ as: 'scoped' }, ({ jwt: { sign, verify }, cookie: { auth } }) => {
		return {
			signUser: async (payload: Static<typeof jwtPayloadSchema>) => {
				const token = await sign(payload)

				auth.value = token
				auth.set({
					httpOnly: true,
					maxAge: 86400 * 7,
					path: '/',
				})
			},
			signOut: () => {
				auth.remove()
			},
			getCurrentUser: async () => {
				const payload = await verify(auth.value)

				if (!payload) {
					throw new UnauthorizedError()
				}

				return {
					sub: payload.sub,
					restaurantId: payload.restaurantId,
				}
			},
		}
	})
	.derive({ as: 'scoped' }, ({ getCurrentUser }) => {
		return {
			getManagedRestaurantId: async () => {
				const { restaurantId } = await getCurrentUser()

				if (!restaurantId) {
					throw new NotAManagerError()
				}

				return restaurantId
			},
		}
	})
