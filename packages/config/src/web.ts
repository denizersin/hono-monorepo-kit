import { z } from "zod";
import { isDev, isProd } from "./env";

/**
 * Web (Next.js) environment schema
 * Client variables must be prefixed with NEXT_PUBLIC_
 */
export const webEnvSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // API URL (public - accessible on client)
  NEXT_PUBLIC_API_URL: z.string().url(),

  // WebSocket URL (public)
  NEXT_PUBLIC_WS_URL: z.string().url().optional(),
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

  return {
    ...parsed.data,
    IS_DEV: isDev,
    IS_PROD: isProd,
  };
}

/**
 * Web environment types
 */
export type WebEnv = ReturnType<typeof validateWebEnv>;
