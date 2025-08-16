import { startTransactionPromisfy } from "@server/modules/infrastructure/database";
import { apiContext } from "./hono/hono-factory";
import { TApiContextRaw } from "./hono/types";


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




export type TApiContext<K extends keyof TApiContextRaw = never> = MakeFieldsNonNullable<TApiContextRaw, K>;




