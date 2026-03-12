import { TLanguageKey, TThemeKey } from "@repo/shared/enums";
import { TSession } from "@repo/shared/types";
import { TDB } from "@server/modules/infrastructure/database";
import type { Env } from "hono";

export interface AppBindings extends Env {
    Bindings: {
    }
    Variables: {
        db: TDB
        session: TSession | null
        companyId: number | null
        language: TLanguageKey
        theme: TThemeKey
    }
}


export type TEventMoreContextData = unknown

export type TApiContextRaw = {
    readonly session: TSession | null
    readonly companyId: number | null
    readonly ip: string | null
    readonly language: TLanguageKey

}

