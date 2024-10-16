import Elysia from 'elysia'

import { env } from '@/env'

import { authenticate } from '@/http/authenticate'
import { registerRestaurant } from '@/http/routes/register-restaurants'
import { registerCustomer } from '@/http/routes/register-customer'
import { sendAuthLink } from '@/http/routes/send-auth-link'
import { authenticateFromLink } from '@/http/routes/authenticate-from-link'
import { signOut } from '@/http/routes/sign-out'
import { getProfile } from '@/http/routes/get-profile'
import { getManagedRestaurant } from '@/http/routes/get-managed-restaurant'
import { updateUser } from '@/http/routes/update-user'
import { updateRestaurant } from '@/http/routes/update-restaurant'
import { createMenu } from '@/http/routes/create-menu'
import { getMenu } from '@/http/routes/get-menu'
import { updateMenu } from '@/http/routes/update-menu'

export const app = new Elysia()
	.use(authenticate)
	.use(registerRestaurant)
	.use(registerCustomer)
	.use(sendAuthLink)
	.use(authenticateFromLink)
	.use(signOut)
	.use(getProfile)
	.use(getManagedRestaurant)
	.use(updateUser)
	.use(updateRestaurant)
	.use(createMenu)
	.use(getMenu)
	.use(updateMenu)
	.onError(({ error, code, set }) => {
		switch (code) {
			case 'VALIDATION':
				set.status = error.status
				return error.toResponse()
			default:
				console.error(error)
				return new Response(null, { status: 500 })
		}
	})

app.listen(env.PORT, () => {
	console.log(`🔥 HTTP Server is running on port ${env.PORT}`)
})
