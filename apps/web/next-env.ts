import { validateWebEnv, webEnvSchema } from "@repo/config/web";

// Validate and export environment variables
export const NEXT_ENV = validateWebEnv({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_WS_URL_DEV: process.env.NEXT_PUBLIC_WS_URL_DEV!,
    NEXT_PUBLIC_WS_URL_PROD: process.env.NEXT_PUBLIC_WS_URL_PROD!,
    NEXT_PUBLIC_API_URL_DEV: process.env.NEXT_PUBLIC_API_URL_DEV!,
    NEXT_PUBLIC_API_URL_PROD: process.env.NEXT_PUBLIC_API_URL_PROD!,
} satisfies typeof webEnvSchema._type);

// Export type for convenience
export type NextEnv = typeof NEXT_ENV;
