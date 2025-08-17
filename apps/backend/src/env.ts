import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    PORT: z.string(),

    //CONSTANTS
    ADMIN_EMAIL: z.string(),
    ADMIN_PASSWORD: z.string(),

    // DATABASE
    DATABASE_URL_DEV: z.string(),
    DATABASE_URL_PROD: z.string(),
    DATABASE_NAME: z.string(),

    WEB_DEV_URL: z.string(),
    WEB_PROD_URL: z.string(),

    // JWT
    JWT_SECRET: z.string(),

    // Wp client
    WP_CLIENT_API_KEY: z.string(),
    WP_CLIENT_URL: z.string(),


    _runtime: z.object({
        IS_DEV: z.boolean(),
        WEB_URL: z.string(),
        DATABASE_URL: z.string(),
    })
})




type Env = z.infer<typeof envSchema>;




const isDev = process.env.NODE_ENV === 'development'


let ENV: Env;
try {
    ENV = envSchema.parse({
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,

        DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,
        DATABASE_URL_PROD: process.env.DATABASE_URL_PROD,
        DATABASE_NAME: process.env.DATABASE_NAME,
        JWT_SECRET: process.env.JWT_SECRET,

        WEB_DEV_URL: process.env.WEB_DEV_URL,
        WEB_PROD_URL: process.env.WEB_PROD_URL,

        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

        WP_CLIENT_API_KEY: process.env.WP_CLIENT_API_KEY,
        WP_CLIENT_URL: process.env.WP_CLIENT_URL,

        _runtime: {
            IS_DEV: isDev,
            DATABASE_URL: isDev ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_PROD,
            WEB_URL: isDev ? process.env.WEB_DEV_URL : process.env.WEB_PROD_URL,

        }
    })
} catch (error) {
    console.log('ENV parse ERROR')
    console.error(error)
    process.exit(1)
}






export { ENV }