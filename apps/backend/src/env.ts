import "dotenv/config";
import { validateBackendEnv } from "@repo/config/backend";

// Validate and export environment variables
export const ENV = validateBackendEnv();

// Export type for convenience
export type Env = typeof ENV;
