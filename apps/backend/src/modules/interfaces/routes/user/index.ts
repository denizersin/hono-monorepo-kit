import { createSuccessResponse, handleError } from "@server/lib/errors"
import { wait } from "@server/lib/utils"
import { honoAuthMiddleware, TAuthMiddlewareContext, TPublicMiddlewareContext } from "@server/modules/shared/middlewares/auth"
import { Hono } from "hono"

const userApp = new Hono<{
    Variables: {
        publicMiddlewareContext: TPublicMiddlewareContext,
        authMiddlewareContext: TAuthMiddlewareContext
    }
}>()
    .use(honoAuthMiddleware)
    .get('/', (c) => {
    
        return c.json({
            message: 'Hello from Hono!',
        })
    })
    .get('/me', async (c) => {
        try {
            await wait(1000)
            return c.json(createSuccessResponse({
                message: 'Hello from Hono!',
            }))
        } catch (error) {
            return handleError(c, error)
        }
    })
    .get('/with-id/:id', async (c) => {
        const id = c.req.param('id')
        return c.json({
            message: 'Hello from Hono!',
            id
        })
    })


userApp.get('/', (c) => {
    const users = c.var.publicMiddlewareContext.db.query.tblUser.findMany()
    return c.json({
        message: 'Hello from Hono!',
        users
    })
})



export default userApp