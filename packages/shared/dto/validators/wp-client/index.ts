import { z } from "zod";

export const handleMessage = z.object({
    media: z.object({
        mimetype: z.string(),
        data: z.string(),
        filename: z.string(),
        filesize: z.number()
    }).nullable().optional(),
    from: z.string(),
    body: z.string()
})


export const wpClientValidator = {
    handleMessage
}

namespace TWpClientValidator {
    export type THandleMessage = z.infer<typeof handleMessage>
}

export default TWpClientValidator