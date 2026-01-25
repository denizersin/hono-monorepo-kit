import { apiContext } from "./hono/hono-factory";
import { TApiContextRaw } from "./hono/types";


type ContextField = keyof TApiContextRaw;

type RequireFields<T, K extends keyof T> =
    T & { [P in K]-?: NonNullable<T[P]> }

export function getApiContext(): TApiContextRaw;
export function getApiContext<K extends ContextField[]>(...requiredFields: K): RequireFields<TApiContextRaw, K[number]>;

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
    })
}




export type TApiContext<K extends keyof TApiContextRaw = never> = MakeFieldsNonNullable<TApiContextRaw, K>;




