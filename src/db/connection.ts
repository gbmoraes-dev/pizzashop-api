import { drizzle } from 'drizzle-orm/postgres-js'

import { env } from '@/env'

import postgres from 'postgres'

import * as schema from '@/db/schemas'

const client = postgres(env.DATABASE_URL)

export const db = drizzle(client, { schema })
