import { z } from 'zod';

// Define the environment schema for Next.js
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    
    // Next.js public environment variables (accessible on client-side)
    NEXT_PUBLIC_API_URL_DEV: z.string().url('Invalid API URL'),
    NEXT_PUBLIC_API_URL_PROD: z.string().url('Invalid API URL'),

    NEXT_PUBLIC_WS_URL_DEV: z.string().url('Invalid WebSocket URL').optional(),
    NEXT_PUBLIC_WS_URL_PROD: z.string().url('Invalid WebSocket URL').optional(),

    
    // Runtime computed values
    _runtime: z.object({
        IS_DEV: z.boolean(),
        IS_PROD: z.boolean(),
        IS_CLIENT: z.boolean(),
        IS_SERVER: z.boolean(),
        NEXT_PUBLIC_API_URL: z.string().url('Invalid API URL'),
        NEXT_PUBLIC_WS_URL: z.string().url('Invalid WebSocket URL').optional(),
        
    })
});

type Env = z.infer<typeof envSchema>;

// Helper to determine if we're on client or server
const isClient = typeof window !== 'undefined';
const isServer = !isClient;
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// Parse and validate environment variables
let NEXT_ENV: Env;

try {
    NEXT_ENV = envSchema.parse({
        NODE_ENV: process.env.NODE_ENV,

        NEXT_PUBLIC_API_URL_DEV: process.env.NEXT_PUBLIC_API_URL_DEV,
        NEXT_PUBLIC_API_URL_PROD: process.env.NEXT_PUBLIC_API_URL_PROD,

        NEXT_PUBLIC_WS_URL_DEV: process.env.NEXT_PUBLIC_WS_URL_DEV,
        NEXT_PUBLIC_WS_URL_PROD: process.env.NEXT_PUBLIC_WS_URL_PROD,
        
        _runtime: {
            IS_DEV: isDev,
            IS_PROD: isProd,
            IS_CLIENT: isClient,
            IS_SERVER: isServer,
            NEXT_PUBLIC_API_URL: isDev ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PROD,
            NEXT_PUBLIC_WS_URL: isDev ? process.env.NEXT_PUBLIC_WS_URL_DEV : process.env.NEXT_PUBLIC_WS_URL_PROD,
        }
    });
} catch (error) {
    console.error('❌ Environment validation failed:');
    if (error instanceof z.ZodError) {
        console.error('Missing or invalid environment variables:');
        error.errors.forEach((err) => {
            console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
    } else {
        console.error(error);
    }
    
    // In development, provide helpful error message
    if (isDev) {
        console.error('\n💡 Create a .env.local file with the required variables:');
        console.error('NEXT_PUBLIC_API_URL=http://localhost:3002');
        console.error('NEXT_PUBLIC_WS_URL=ws://localhost:3002');
        console.error('NEXT_PUBLIC_APP_NAME="My App"');
        console.error('NEXT_PUBLIC_APP_VERSION="1.0.0"');
    }
    
    process.exit(1);
}


export { NEXT_ENV }