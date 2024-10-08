import Elysia from 'elysia'

import { env } from '@/env'

import { registerRestaurant } from '@/http/routes/register-restaurants'
import { sendAuthLink } from '@/http/routes/send-auth-link'

export const app = new Elysia().use(registerRestaurant).use(sendAuthLink)

app.listen(env.PORT, () => {
	console.log(`🔥 HTTP Server is running on port ${env.PORT}`)
})
