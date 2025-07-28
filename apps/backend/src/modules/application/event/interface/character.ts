import { client } from "@server/exports/exports"
import { TApiContext } from "@server/lib/hono/utils"
import { InferRequestType, InferResponseType } from "hono"
import { TBaseEvent, TBaseEventLogData, TEventCtx } from "."

export const ENUM_CHARACTER_EVENTS = {
    CHARACTER_CREATED: 'CHARACTER_CREATED',
    CHARACTER_UPDATED: 'CHARACTER_UPDATED',
    CHARACTER_DELETED: 'CHARACTER_DELETED',
} as const

export const ENUM_CHARACTER_EVENT_IDS = {
    CHARACTER_CREATED: 201,
    CHARACTER_UPDATED: 202,
    CHARACTER_DELETED: 203,
}





export type TEventCharacter = {
    [ENUM_CHARACTER_EVENTS.CHARACTER_CREATED]: TBaseEvent<'CHARACTER_CREATED'> & {
        props: {
            type: typeof ENUM_CHARACTER_EVENTS.CHARACTER_CREATED,
            input: InferRequestType<typeof client.character.persona.create.$post>['json'],
            output: InferResponseType<typeof client.character.persona.create.$post>['data']['data'],
            ctx: TEventCtx<'session'> & {
                contextData: TEventCharacter['CHARACTER_CREATED']['contextData']
            }
            thisIsCharacterCreated: true,
  
        },
        contextData: {

            //supose this will be called by the service1 
            service1: {
                moreField1: string,
                moreField2: string,
            },
            //supose this will be called by the service2
            service2: {
                moreField1: string,
                moreField2: string,
            },
        }
    },
    [ENUM_CHARACTER_EVENTS.CHARACTER_DELETED]: TBaseEvent<'CHARACTER_DELETED'>,
    [ENUM_CHARACTER_EVENTS.CHARACTER_UPDATED]: TBaseEvent<'CHARACTER_UPDATED'> & {
        props: {
            type: typeof ENUM_CHARACTER_EVENTS.CHARACTER_UPDATED
            ctx: TEventCtx
            logData: {
                type: typeof ENUM_CHARACTER_EVENTS.CHARACTER_UPDATED,
                creatorId: number,
                occurredAt: Date,
                description?: string,
            }
        }
    }
}






