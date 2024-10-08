import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

import { createId } from '@paralleldrive/cuid2'

import { users } from '@/db/schemas/users'

export const restaurants = pgTable('restaurants', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	managerId: text('manager_id').references(() => users.id, {
		onDelete: 'set null',
	}),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
})

export const restaurantsRelations = relations(restaurants, ({ one }) => {
	return {
		manager: one(users, {
			fields: [restaurants.managerId],
			references: [users.id],
			relationName: 'restaurant_manager',
		}),
	}
})
