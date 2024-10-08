import { z } from 'zod'

const envSchema = z.object({
	PORT: z.string(),
	DATABASE_URL: z.string(),
	API_BASE_URL: z.string(),
	AUTH_REDIRECT_URL: z.string(),
})

export const env = envSchema.parse(process.env)
