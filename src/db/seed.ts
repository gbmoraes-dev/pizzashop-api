import { db } from '@/db/connection'

import { users, restaurants } from '@/db/schemas'

import { faker } from '@faker-js/faker'

import chalk from 'chalk'

await db.delete(users)
await db.delete(restaurants)

console.log(chalk.yellowBright('Database reseted succesfully!'))

await db.insert(users).values([
	{
		name: faker.person.firstName(),
		email: faker.internet.email(),
		phone: faker.phone.number(),
		role: 'customer',
	},
	{
		name: faker.person.firstName(),
		email: faker.internet.email(),
		phone: faker.phone.number(),
		role: 'customer',
	},
	{
		name: faker.person.firstName(),
		email: faker.internet.email(),
		phone: faker.phone.number(),
		role: 'customer',
	},
])

console.log(chalk.yellowBright('Costumers created succesully!'))

const [manager] = await db
	.insert(users)
	.values([
		{
			name: faker.person.firstName(),
			email: 'admin@admin.com',
			phone: faker.phone.number(),
			role: 'manager',
		},
	])
	.returning({ id: users.id })

console.log(chalk.yellowBright('Manager created succesully!'))

await db.insert(restaurants).values([
	{
		name: faker.company.name(),
		description: faker.lorem.paragraph(),
		managerId: manager.id,
	},
])

console.log(chalk.yellowBright('Restaurant created succesully!'))

console.log(chalk.greenBright('Datanase seeded succesully!'))

process.exit()
