import { TDB } from "@server/modules/infrastructure/database";
import type { Env } from "hono";

export interface AppBindings extends Env {
    Bindings: {
    }
    Variables: {
        db: TDB
    }
}

