import Elysia from 'elysia'

import { env } from '@/env'

import { registerRestaurant } from '@/http/routes/register-restaurants'

export const app = new Elysia().use(registerRestaurant)

app.listen(env.PORT, () => {
	console.log(`🔥 HTTP Server is running on port ${env.PORT}`)
})
