import { createSuccessResponse } from "@server/lib/errors"
import { createHonoApp } from "@server/lib/hono/hono-factory"
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