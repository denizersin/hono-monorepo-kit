import { TSession } from "@repo/shared/types";
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
    }
}


export type TEventMoreContextData = unknown

export type TApiContextRaw = {
    session: TSession | null
    companyId: number | null
    startTrx: () => Promise<void>
    trx: TDBTransaction | null
    ip: string | null
    contextData: TEventMoreContextData
    updateContextData: (data: TEventMoreContextData | ((current: TEventMoreContextData) => TEventMoreContextData)) => void

    eventCallbackQueue: {
        type?: TGlobalEvent
        isAfterRequest?: boolean
        callback: Function
    }[]
}

