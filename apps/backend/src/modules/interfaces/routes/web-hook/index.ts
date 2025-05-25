import { zValidator } from "@hono/zod-validator"
import { wpClientValidator } from "@repo/shared/validators"
import { createSuccessResponse } from "@server/lib/errors"
import honoFactory from "@server/lib/hono/hono-factory"





const webHookApp = honoFactory.createApp()
    // .use(honoAuthMiddleware)
    .post('/handle-wp-client-message', zValidator('json', wpClientValidator.handleMessage), async (c) => {
        const body = c.req.valid('json')
        console.log(body)
        return c.json(createSuccessResponse(body))
    })
    .get('/',
        (c) => {
            return c.json({
                message: 'Hello from Hono!',
            })
        })








export default webHookApp