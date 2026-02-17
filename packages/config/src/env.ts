import { z } from "zod";

/**
 * Common validation helper for environment variables
 */
export function validateEnv<T extends z.ZodType>(
  schema: T,
  env = {},
): z.infer<T> {
  const parsed = schema.safeParse(env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    parsed.error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
    throw new Error("Invalid environment variables");
  }


  return parsed.data;
}

/**
 * Runtime helpers
 */
export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";
