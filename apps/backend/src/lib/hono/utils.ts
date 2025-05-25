import { Context } from "hono"
import { z, ZodSchema } from "zod"


export const customZodValidator = async <T extends ZodSchema>(schema: T, c: Context): Promise<z.infer<T>> => {
    const data = await c.req.json()
    const result = schema.safeParse(data)
    return result.data
}



