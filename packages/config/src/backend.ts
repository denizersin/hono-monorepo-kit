import { z } from "zod";
import { isDev, isProd } from "./env";

/**
 * Backend environment schema
 */
export const backendEnvSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3002"),

  // Database
  DATABASE_URL_DEV: z.string().url(),
  DATABASE_URL_PROD: z.string().url(),
  DATABASE_NAME: z.string(),

  // Web URLs
  WEB_DEV_URL: z.string().url(),
  WEB_PROD_URL: z.string().url(),

  // Auth
  JWT_SECRET: z.string().min(1),

  // Admin credentials
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(1),

  // WordPress client
  WP_CLIENT_API_KEY: z.string(),
  WP_CLIENT_URL: z.string().url(),

  // Redis
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_DB: z.string(),
  BULL_BOARD_BASE_PATH: z.string(),
});

/**
 * Validate backend environment variables
 */
export function validateBackendEnv(env = process.env) {
  const parsed = backendEnvSchema.safeParse(env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    parsed.error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
    throw new Error("Invalid environment variables");
  }

  const data = parsed.data;

  return {
    ...data,
    _runtime: {
      IS_DEV: isDev,
      IS_PROD: isProd,
      DATABASE_URL: isDev ? data.DATABASE_URL_DEV : data.DATABASE_URL_PROD,
      WEB_URL: isDev ? data.WEB_DEV_URL : data.WEB_PROD_URL,
    },
  };
}

/**
 * Backend environment types
 */
export type BackendEnv = z.infer<typeof backendEnvSchema> & {
  _runtime: {
    IS_DEV: boolean;
    IS_PROD: boolean;
    DATABASE_URL: string;
    WEB_URL: string;
  };
};
