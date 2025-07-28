//example implementation

import { TApiContext } from "@server/lib/hono/utils"
import { ENUM_CHARACTER_EVENT_IDS, ENUM_CHARACTER_EVENTS, TEventCharacter } from "./character"
import { ENUM_USER_EVENT_IDS, ENUM_USER_EVENTS, TEventUser } from "./user"
import { TApiContextRaw } from "@server/lib/hono/types"


export type TEventCtx<T extends keyof TApiContextRaw = never> = Omit<TApiContext<T>, 'updateContextData' | 'trx' | 'startTrx'>


export const ENUM_ALL_EVENTS = {
    ...ENUM_USER_EVENTS,
    ...ENUM_CHARACTER_EVENTS,
} as const

export const ENUM_ALL_EVENT_IDS = {
    ...ENUM_USER_EVENT_IDS,
    ...ENUM_CHARACTER_EVENT_IDS,
} as const

export type TGlobalEvents = TEventUser & TEventCharacter

export type TGlobalEvent = keyof TGlobalEvents

export type TBaseEventLogData<T extends keyof typeof ENUM_ALL_EVENTS> = {
    type: T,
    creatorId?: number,
    creatorName?: string, 
    previousString?: string,
    newString?: string,
    occurredAt: Date,
    description: string,
}

export type TBaseEvent<T extends keyof typeof ENUM_ALL_EVENTS> = {
    props: {
        type: T,
        ctx: TEventCtx
        logData?: TBaseEventLogData<T>
        withDefaultLog?: boolean,
    }
}





