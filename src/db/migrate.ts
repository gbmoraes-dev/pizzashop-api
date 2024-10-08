import { drizzle } from 'drizzle-orm/postgres-js'

import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { env } from '@/env'

import postgres from 'postgres'

import chalk from 'chalk'

import * as schema from '@/db/schemas'

const client = postgres(env.DATABASE_URL, { max: 1 })
const db = drizzle(client, { schema })

await migrate(db, { migrationsFolder: 'drizzle' })

console.log(chalk.greenBright('Migrations applied succesully!'))

await client.end()

process.exit()
