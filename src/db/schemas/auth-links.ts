import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { createId } from '@paralleldrive/cuid2'

import { users } from '@/db/schemas/users'

export const authLinks = pgTable('auth_links', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	code: text('code').unique().notNull(),
	userId: text('user_id')
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow(),
})
