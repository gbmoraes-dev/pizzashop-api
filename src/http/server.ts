import Elysia from 'elysia'

import { env } from '@/env'

export const app = new Elysia()

app.listen(env.PORT, () => {
	console.log(`🔥 HTTP Server is running on port ${env.PORT}`)
})
