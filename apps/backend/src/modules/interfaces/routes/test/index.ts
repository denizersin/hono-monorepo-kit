import { AuthenticationError, createSuccessResponse, CustomError } from "@server/lib/errors"
import honoFactory, { createHonoApp } from "@server/lib/hono/hono-factory"
import { SahredEnums } from "@repo/shared/enums"
// import {  } from "@repo/shared/dto/validators/auth"


// const authApp = new Hono<{
//     Variables: {
//         publicMiddlewareContext: TPublicMiddlewareContext
//     }
// }>()

const examplesApp = createHonoApp()
    .get('/', async (c) => {
        
    })
    .post('/upload',
        async (c) => {
            const body = await c.req.parseBody()
            console.log('file')
            console.log(body)
            console.log(body['file']) // File | string


            return c.json(createSuccessResponse({
                message: 'File uploaded successfully!'
            }))
        })

export default examplesApp