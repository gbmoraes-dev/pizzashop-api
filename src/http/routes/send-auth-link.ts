import Elysia, { t } from 'elysia'

import nodemailer from 'nodemailer'

import { createId } from '@paralleldrive/cuid2'

import { env } from '@/env'

import { db } from '@/db/connection'

import { authLinks } from '@/db/schemas'

import { errors } from '@/http/errors'

import { ContentNotFoundError } from '@/http/errors/content-not-found-error'

import { mail } from '@/lib/mail'

export const sendAuthLink = new Elysia().use(errors).post(
	'/authenticate',
	async ({ body }) => {
		const { email } = body

		const user = await db.query.users.findFirst({
			where(fields, { eq }) {
				return eq(fields.email, email)
			},
		})

		if (!user) {
			throw new ContentNotFoundError()
		}

		const code = createId()

		await db.insert(authLinks).values({
			userId: user.id,
			code: code,
		})

		const authLink = new URL('/auth-link/authenticate', env.API_BASE_URL)

		authLink.searchParams.set('code', code)
		authLink.searchParams.set('redirect_url', env.AUTH_REDIRECT_URL)

		const emailWithLink = await mail.sendMail({
			from: {
				name: 'Pizza Shop',
				address: 'hi@pizzashop.com',
			},
			to: email,
			subject: 'Authenticate your Pizza Shop account',
			text: `Click the link below to authenticate your account: ${authLink.toString()}`,
		})

		console.log(nodemailer.getTestMessageUrl(emailWithLink))
	},
	{
		body: t.Object({
			email: t.String({ format: 'email' }),
		}),
	},
)
