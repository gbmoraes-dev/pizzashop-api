import Elysia from 'elysia'

import { authenticate } from '@/http/authenticate'

export const signOut = new Elysia()
	.use(authenticate)
	.post('/sign-out', async ({ signOut: methodSignOut }) => {
		methodSignOut()
	})
