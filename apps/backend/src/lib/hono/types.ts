import { TLanguage, TSession, TTheme } from "@repo/shared/types";
import { TGlobalEvent } from "@server/modules/application/event/interface";
import { TDB, TDBTransaction } from "@server/modules/infrastructure/database";
import type { Env } from "hono";

export interface AppBindings extends Env {
    Bindings: {
    }
    Variables: {
        db: TDB
        session: TSession | null
        companyId: number | null
        language: TLanguage
        theme: TTheme
    }
}


export type TEventMoreContextData = unknown

export type TApiContextRaw = {
    readonly session: TSession | null
    readonly companyId: number | null
    readonly ip: string | null
    readonly language: TLanguage

}

