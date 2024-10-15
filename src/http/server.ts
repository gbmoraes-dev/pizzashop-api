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

export const app = new Elysia()
	.use(authenticate)
	.use(registerRestaurant)
	.use(registerCustomer)
	.use(sendAuthLink)
	.use(authenticateFromLink)
	.use(signOut)
	.use(getProfile)
	.use(getManagedRestaurant)

app.listen(env.PORT, () => {
	console.log(`🔥 HTTP Server is running on port ${env.PORT}`)
})
