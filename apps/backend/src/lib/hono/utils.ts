import { Context } from "hono"
import { z, ZodSchema } from "zod"
import { TApiContextRaw, TEventMoreContextData } from "./types"
import { TSession } from "@repo/shared/types"
import { startTransactionPromisfy, TDBTransaction } from "@server/modules/infrastructure/database"
import { apiContext } from "./hono-factory"


export const customZodValidator = async <T extends ZodSchema>(schema: T, c: Context): Promise<z.infer<T>> => {
    const data = await c.req.json()
    const result = schema.safeParse(data)
    return result.data
}





type ContextField = keyof TApiContextRaw;

// Version where specific fields are non-null
type RequireFields<T, K extends keyof T> =
    T & { [P in K]-?: NonNullable<T[P]> }

// 🔁 Overloads
export function getApiContext(): TApiContextRaw;
export function getApiContext<K extends ContextField[]>(...requiredFields: K): RequireFields<TApiContextRaw, K[number]>;

// 🧠 Implementation
export function getApiContext(...requiredFields: ContextField[]): TApiContextRaw {
    const ctx = apiContext.getStore() as TApiContextRaw

    for (const key of requiredFields) {
        if (ctx[key] == null) {
            throw new Error(`${key} is required but was null`);
        }
    }

    return ctx;
}

export function initApiContext(ctx: TApiContextRaw) {
    apiContext.enterWith({
        ...ctx,
        startTrx: async () => {
            const trx = await startTransactionPromisfy()
            apiContext.enterWith({
                ...ctx,
                trx
            })
        },
        updateContextData: (data) => {
            if (typeof data === 'function') {
                const result = data(ctx.contextData)
                if (result) {
                    apiContext.enterWith({
                        ...ctx,
                        contextData: result,
                    })
                }
            } else {
                apiContext.enterWith({
                    ...ctx,
                    contextData: data
                })
            }
        }
    })
}


type MakeFieldsNonNullable<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P]
}

export type TApiContext<K extends keyof TApiContextRaw = never> = MakeFieldsNonNullable<TApiContextRaw, K>;




