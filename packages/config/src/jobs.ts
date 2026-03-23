import { z } from "zod";
import { isDev, isProd } from "./env";

/**
 * Jobs worker environment schema
 * Includes Redis for queue + Database for processors
 */
export const jobsEnvSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.string().default("6379"),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().default("0"),
});

/**
 * Build Redis URL from individual components
 */
function buildRedisUrl(data: z.infer<typeof jobsEnvSchema>): string {
  const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB } = data;
  if (REDIS_PASSWORD) {
    return `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`;
  }
  return `redis://${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`;
}

/**
 * Validate jobs worker environment variables
 */
export function validateJobsEnv(env = process.env) {
  const parsed = jobsEnvSchema.safeParse(env);

  if (!parsed.success) {
    console.error("❌ Invalid jobs environment variables:");
    parsed.error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
    throw new Error("Invalid jobs environment variables");
  }

  return {
    ...parsed.data,
    IS_DEV: isDev,
    IS_PROD: isProd,
    REDIS_URL: buildRedisUrl(parsed.data),
  };
}

/**
 * Jobs environment types
 */
export type JobsEnv = ReturnType<typeof validateJobsEnv>;
