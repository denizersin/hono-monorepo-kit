import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']),

    // DATABASE
    DATABASE_URL: z.string(),
    DATABASE_URL_DEV: z.string(),
    DATABASE_URL_PROD: z.string(),
    DATABASE_NAME: z.string(),

    // JWT
    JWT_SECRET: z.string(),


    _runtime: z.object({
        IS_DEV: z.boolean().default(false),
    })
})




type Env = z.infer<typeof envSchema>;







const ENV:Env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,
    DATABASE_URL_PROD: process.env.DATABASE_URL_PROD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    _runtime: {
        IS_DEV: process.env.NODE_ENV === 'development'
    }
})





export { ENV }