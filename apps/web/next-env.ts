import { validateWebEnv, webEnvSchema } from "@repo/config/web";

// Validate and export environment variables
export const NEXT_ENV = validateWebEnv({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL!,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
} satisfies typeof webEnvSchema._type);

// Export type for convenience
export type NextEnv = typeof NEXT_ENV;
