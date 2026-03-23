import { z } from "zod";
import { isDev, isProd } from "./env";

/**
 * Mobile (Expo) environment schema
 */
export const mobileEnvSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // API URL
  API_URL: z.string().url(),

  // WebSocket URL
  WS_URL: z.string().url(),
});

/**
 * Validate mobile environment variables
 */
export function validateMobileEnv(env = process.env) {
  const parsed = mobileEnvSchema.safeParse(env);

  if (!parsed.success) {
    console.error("❌ Invalid mobile environment variables:");
    parsed.error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
    throw new Error("Invalid mobile environment variables");
  }

  return {
    ...parsed.data,
    IS_DEV: isDev,
    IS_PROD: isProd,
  };
}

/**
 * Mobile environment types
 */
export type MobileEnv = ReturnType<typeof validateMobileEnv>;
