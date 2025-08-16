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


