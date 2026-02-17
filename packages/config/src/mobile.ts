import { z } from "zod";
import { validateEnv, isDev } from "./env";

/**
 * Mobile (Expo) environment schema
 */
export const mobileEnvSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // API URLs
  API_URL_DEV: z.string().url(),
  API_URL_PROD: z.string().url(),

  // WebSocket URLs
  WS_URL_DEV: z.string().url(),
  WS_URL_PROD: z.string().url(),

  // Runtime computed values
  _runtime: z.object({
    IS_DEV: z.boolean(),
    API_URL: z.string().url(),
    WS_URL: z.string().url(),
  }),
});

/**
 * Validate mobile environment variables
 */
export function validateMobileEnv(env = process.env) {
  return validateEnv(
    mobileEnvSchema.transform((data) => ({
      ...data,
      _runtime: {
        IS_DEV: isDev,
        API_URL: isDev ? data.API_URL_DEV : data.API_URL_PROD,
        WS_URL: isDev ? data.WS_URL_DEV : data.WS_URL_PROD,
      },
    })),
    env,
  );
}

/**
 * Mobile environment types
 */
export type MobileEnv = z.infer<typeof mobileEnvSchema>;
