import { z } from 'zod'

const envSchema = z.object({
	PORT: z.string(),
	DATABASE_URL: z.string().url(),
	API_BASE_URL: z.string().url(),
	AUTH_REDIRECT_URL: z.string().url(),
	JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
