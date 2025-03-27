import { createSuccessResponse, handleAppError } from "@server/lib/errors"
import honoFactory from "@server/lib/hono/hono-factory"
import { wait } from "@server/lib/utils"
import { honoAuthMiddleware } from "@server/modules/shared/middlewares/auth"

// const userApp = new Hono<{
//     Variables: {
//         publicMiddlewareContext: TPublicMiddlewareContext,
//         authMiddlewareContext: TAuthMiddlewareContext
//     }
// }>()

const userApp = honoFactory.createApp()
    .use(honoAuthMiddleware)
    .get('/', (c) => {
        return c.json({
            message: 'Hello from Hono!',
        })
    })
    .get('/me', async (c) => {
        await wait(1000)
        return c.json(createSuccessResponse({
            message: 'Hello from Hono!',
        }))
    })
    .get('/with-id/:id', async (c) => {
        const id = c.req.param('id')
        return c.json({
            message: 'Hello from Hono!',
            id
        })
    })


userApp.get('/', (c) => {

    const users = c.var.db.query.tblUser.findMany()
    return c.json({
        message: 'Hello from Hono!',
        users
    })
})



export default userApp