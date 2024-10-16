import Elysia, { t } from 'elysia'

import { db } from '@/db/connection'

import { users } from '@/db/schemas'

import { EmailAlreadyExistsError } from '@/http/errors/email-already-exists-error'

export const registerCustomer = new Elysia().post(
	'/customer',
	async ({ body, set }) => {
		const { name, email, phone } = body

		const emailAlreadyExists = await db.query.users.findFirst({
			where(fields, { eq }) {
				return eq(fields.email, email)
			},
		})

		if (emailAlreadyExists) {
			throw new EmailAlreadyExistsError()
		}

		await db.insert(users).values({
			name: name,
			email: email,
			phone: phone,
		})

		set.status = 204
	},
	{
		body: t.Object({
			name: t.String(),
			email: t.String({ format: 'email' }),
			phone: t.String(),
		}),
	},
)
