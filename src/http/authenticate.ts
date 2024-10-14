import Elysia, { t } from 'elysia'

import jwt from '@elysiajs/jwt'

import { env } from '@/env'

export const authenticate = new Elysia().use(
	jwt({
		secret: env.JWT_SECRET,
		schema: t.Object({
			sub: t.String(),
			restaurantId: t.Optional(t.String()),
		}),
	}),
)
