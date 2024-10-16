import Elysia from 'elysia'

import { UnauthorizedError } from '@/http/errors/unauthorized-error'
import { NotAManagerError } from '@/http/errors//not-a-manager-error'
import { ContentNotFoundError } from '@/http/errors/content-not-found-error'
import { LinkExpiredError } from '@/http/errors/link-expired-error'
import { EmailAlreadyExistsError } from '@/http/errors/email-already-exists-error'
import { ProductNotAvailable } from '@/http/errors/product-not-available'

export const errors = new Elysia()
	.error({
		UNAUTHORIZED: UnauthorizedError,
		NOT_A_MANAGER: NotAManagerError,
		CONTENT_NOT_FOUND: ContentNotFoundError,
		LINK_EXPIRED: LinkExpiredError,
		EMAIL_ALREADY_EXISTS: EmailAlreadyExistsError,
		PRODUCT_NOT_AVAILABLE: ProductNotAvailable,
	})
	.onError(({ error, code, set }) => {
		switch (code) {
			case 'UNAUTHORIZED':
				set.status = 401
				return { code, message: error.message }
			case 'NOT_A_MANAGER':
				set.status = 401
				return { code, message: error.message }
			case 'CONTENT_NOT_FOUND':
				set.status = 404
				return { code, message: error.message }
			case 'LINK_EXPIRED':
				set.status = 400
				return { code, message: error.message }
			case 'EMAIL_ALREADY_EXISTS':
				set.status = 400
				return { code, message: error.message }
			case 'PRODUCT_NOT_AVAILABLE':
				set.status = 400
				return { code, message: error.message }
		}
	})
