import { z } from "zod";
import { isDev, isProd } from "./env";

/**
 * Web (Next.js) environment schema
 * Client variables must be prefixed with NEXT_PUBLIC_
 */
export const webEnvSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // API URLs (public - accessible on client)
  NEXT_PUBLIC_API_URL_DEV: z.string().url(),
  NEXT_PUBLIC_API_URL_PROD: z.string().url(),

  // WebSocket URLs (public)
  NEXT_PUBLIC_WS_URL_DEV: z.string().url().optional(),
  NEXT_PUBLIC_WS_URL_PROD: z.string().url().optional(),
});

/**
 * Validate web environment variables
 */
export function validateWebEnv(env: typeof webEnvSchema._type) {
  const parsed = webEnvSchema.safeParse(env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    parsed.error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
    throw new Error("Invalid environment variables");
  }
  console.log('successfully validated web environment variables')

  const data = parsed.data;

  return {
    ...data,
    _runtime: {
      IS_DEV: isDev,
      IS_PROD: isProd,
      NEXT_PUBLIC_API_URL: isDev
        ? data.NEXT_PUBLIC_API_URL_DEV
        : data.NEXT_PUBLIC_API_URL_PROD,
      NEXT_PUBLIC_WS_URL: isDev
        ? data.NEXT_PUBLIC_WS_URL_DEV
        : data.NEXT_PUBLIC_WS_URL_PROD,
    },
  };
}

/**
 * Web environment types
 */
export type WebEnv = z.infer<typeof webEnvSchema> & {
  _runtime: {
    IS_DEV: boolean;
    IS_PROD: boolean;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_WS_URL?: string;
  };
};
