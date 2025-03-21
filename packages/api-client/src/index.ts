
import { ROUTES } from "@repo/backend/exports"

import { hc } from "hono/client";


 const client = hc<typeof ROUTES>("");
export type Client = typeof client;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<typeof ROUTES>(...args);


