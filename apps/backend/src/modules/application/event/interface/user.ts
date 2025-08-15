
import { TBaseEvent, TBaseEventLogData, TEventCtx } from "."


export const ENUM_USER_EVENTS = {
    USER_CREATED: 'USER_CREATED',
    USER_UPDATED: 'USER_UPDATED',
    USER_DELETED: 'USER_DELETED',
    USER_REGISTERED: 'USER_REGISTERED',
    USER_LOGGED_IN: 'USER_LOGGED_IN',
} as const

export type TUserEvent = keyof typeof ENUM_USER_EVENTS


export const ENUM_USER_EVENT_IDS: Record<TUserEvent, number> = {
    USER_CREATED: 101,
    USER_UPDATED: 102,
    USER_DELETED: 103,
    USER_REGISTERED: 104,
    USER_LOGGED_IN: 105,
}



export type TEventUserData = {
    [ENUM_USER_EVENTS.USER_CREATED]: TBaseEvent<'USER_CREATED'> & {
        props: {
            type: typeof ENUM_USER_EVENTS.USER_CREATED,
            userField: 'asd'
            ctx: TEventCtx
            logData: TBaseEventLogData<'USER_CREATED'>&{
                userField: 'asd'
            }
        }
    },
    [ENUM_USER_EVENTS.USER_REGISTERED]: TBaseEvent<'USER_REGISTERED'>
    [ENUM_USER_EVENTS.USER_LOGGED_IN]: TBaseEvent<'USER_LOGGED_IN'>
}