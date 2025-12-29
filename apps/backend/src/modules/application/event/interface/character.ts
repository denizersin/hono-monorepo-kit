import { client } from "@server/exports/exports"
import { InferRequestType, InferResponseType } from "hono"
import { TBaseEvent, TEventSettings } from "."

export const ENUM_CHARACTER_EVENTS = {
    CHARACTER_CREATED: 'CHARACTER_CREATED',
    CHARACTER_UPDATED: 'CHARACTER_UPDATED',
    CHARACTER_DELETED: 'CHARACTER_DELETED',
    CHARACTER_DELETED_BY_USER: 'CHARACTER_DELETED_BY_USER',
    CHARACTER_MINOR_UPDATED: 'CHARACTER_MINOR_UPDATED',
} as const

export type TCharacterEvent = keyof typeof ENUM_CHARACTER_EVENTS
 

export const ENUM_CHARACTER_EVENT_IDS: Record<TCharacterEvent, number> = {
    CHARACTER_CREATED: 201,
    CHARACTER_UPDATED: 202,
    CHARACTER_DELETED: 203,
    CHARACTER_DELETED_BY_USER: 204,
    CHARACTER_MINOR_UPDATED: 205,
}


export const CHARACTER_EVENT_SETTINGS: TEventSettings = {
    [ENUM_CHARACTER_EVENTS.CHARACTER_MINOR_UPDATED]: {
        withoutLog: true,
    }
}



export type TEventCharacterData = {
    [ENUM_CHARACTER_EVENTS.CHARACTER_CREATED]: TBaseEvent<'CHARACTER_CREATED'> & {
        props: {
            type: typeof ENUM_CHARACTER_EVENTS.CHARACTER_CREATED,
            input: InferRequestType<typeof client.character.persona.create.$post>['json'],
            output: InferResponseType<typeof client.character.persona.create.$post>['data']['data'],
            data:{

            }

        },
    },
    [ENUM_CHARACTER_EVENTS.CHARACTER_DELETED]: TBaseEvent<'CHARACTER_DELETED'>,
    [ENUM_CHARACTER_EVENTS.CHARACTER_UPDATED]: TBaseEvent<'CHARACTER_UPDATED'> & {
        props: {
            type: typeof ENUM_CHARACTER_EVENTS.CHARACTER_UPDATED
            data: {

            }
            logData: {
                type: typeof ENUM_CHARACTER_EVENTS.CHARACTER_UPDATED,
                creatorId: number,
                occurredAt: Date,
                description?: string,
            }
        }
    }
}






