import Elysia, { Cookie, t } from 'elysia'

import { env } from '@/env'

import { authenticate } from '@/http/authenticate'
import { registerRestaurant } from '@/http/routes/register-restaurants'
import { sendAuthLink } from '@/http/routes/send-auth-link'
import { authenticateFromLink } from '@/http/routes/authenticate-from-link'

export const app = new Elysia()
	.use(authenticate)
	.use(registerRestaurant)
	.use(sendAuthLink)
	.use(authenticateFromLink)

app.listen(env.PORT, () => {
	console.log(`🔥 HTTP Server is running on port ${env.PORT}`)
})
