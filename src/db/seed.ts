import { db } from '@/db/connection'

import {
	users,
	restaurants,
	orders,
	orderItems,
	products,
	authLinks,
} from '@/db/schemas'

import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'

import chalk from 'chalk'

/**
 * Reset database
 **/

await db.delete(orderItems)
await db.delete(orders)
await db.delete(products)
await db.delete(restaurants)
await db.delete(authLinks)
await db.delete(users)

console.log(chalk.yellowBright('✔ Database reseted succesfully!'))

/**
 * Create customers
 **/

const [customer1, customer2] = await db
	.insert(users)
	.values([
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			role: 'customer',
		},
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			role: 'customer',
		},
	])
	.returning()

console.log(chalk.yellowBright('✔ Costumers created succesully!'))

/**
 * Create restaurant manager
 **/

const [manager] = await db
	.insert(users)
	.values({
		name: faker.person.fullName(),
		email: 'admin@admin.com',
		role: 'manager',
	})
	.returning()

console.log(chalk.yellowBright('✔ Manager created succesully!'))

/**
 * Create restaurant
 **/

const [restaurant] = await db
	.insert(restaurants)
	.values({
		name: faker.company.name(),
		description: faker.lorem.paragraph(),
		managerId: manager.id,
	})
	.returning()

console.log(chalk.yellowBright('✔ Restaurant created succesully!'))

/**
 * Create products
 **/

const availableProducts = await db
	.insert(products)
	.values([
		{
			name: faker.commerce.productName(),
			priceInCents: Number(
				faker.commerce.price({
					min: 190,
					max: 490,
					dec: 0,
				}),
			),
			restaurantId: restaurant.id,
			description: faker.commerce.productDescription(),
		},
		{
			name: faker.commerce.productName(),
			priceInCents: Number(
				faker.commerce.price({
					min: 190,
					max: 490,
					dec: 0,
				}),
			),
			restaurantId: restaurant.id,
			description: faker.commerce.productDescription(),
		},
		{
			name: faker.commerce.productName(),
			priceInCents: Number(
				faker.commerce.price({
					min: 190,
					max: 490,
					dec: 0,
				}),
			),
			restaurantId: restaurant.id,
			description: faker.commerce.productDescription(),
		},
		{
			name: faker.commerce.productName(),
			priceInCents: Number(
				faker.commerce.price({
					min: 190,
					max: 490,
					dec: 0,
				}),
			),
			restaurantId: restaurant.id,
			description: faker.commerce.productDescription(),
		},
		{
			name: faker.commerce.productName(),
			priceInCents: Number(
				faker.commerce.price({
					min: 190,
					max: 490,
					dec: 0,
				}),
			),
			restaurantId: restaurant.id,
			description: faker.commerce.productDescription(),
		},
		{
			name: faker.commerce.productName(),
			priceInCents: Number(
				faker.commerce.price({
					min: 190,
					max: 490,
					dec: 0,
				}),
			),
			restaurantId: restaurant.id,
			description: faker.commerce.productDescription(),
		},
		{
			name: faker.commerce.productName(),
			priceInCents: Number(
				faker.commerce.price({
					min: 190,
					max: 490,
					dec: 0,
				}),
			),
			restaurantId: restaurant.id,
			description: faker.commerce.productDescription(),
		},
		{
			name: faker.commerce.productName(),
			priceInCents: Number(
				faker.commerce.price({
					min: 190,
					max: 490,
					dec: 0,
				}),
			),
			restaurantId: restaurant.id,
			description: faker.commerce.productDescription(),
		},
		{
			name: faker.commerce.productName(),
			priceInCents: Number(
				faker.commerce.price({
					min: 190,
					max: 490,
					dec: 0,
				}),
			),
			restaurantId: restaurant.id,
			description: faker.commerce.productDescription(),
		},
	])
	.returning()

console.log(chalk.yellow('✔ Products created succesully!'))

/**
 * Create orders
 **/

const ordersToInsert: (typeof orders.$inferInsert)[] = []
const orderItemsToPush: (typeof orderItems.$inferInsert)[] = []

for (let i = 0; i < 200; i++) {
	const orderId = createId()

	const orderProducts = faker.helpers.arrayElements(availableProducts, {
		min: 1,
		max: 3,
	})

	let totalInCents = 0

	// biome-ignore lint/complexity/noForEach: <explanation>
	orderProducts.forEach((orderProduct) => {
		const quantity = faker.number.int({
			min: 1,
			max: 3,
		})

		totalInCents += orderProduct.priceInCents * quantity

		orderItemsToPush.push({
			orderId,
			productId: orderProduct.id,
			priceInCents: orderProduct.priceInCents,
			quantity,
		})
	})

	ordersToInsert.push({
		id: orderId,
		customerId: faker.helpers.arrayElement([customer1.id, customer2.id]),
		restaurantId: restaurant.id,
		status: faker.helpers.arrayElement([
			'pending',
			'canceled',
			'processing',
			'delivering',
			'delivered',
		]),
		totalInCents,
		createdAt: faker.date.recent({
			days: 40,
		}),
	})
}

await db.insert(orders).values(ordersToInsert)
await db.insert(orderItems).values(orderItemsToPush)

console.log(chalk.yellow('✔ Orders created succesfully!'))

console.log(chalk.greenBright('✔ Datanase seeded succesully!'))

process.exit()
