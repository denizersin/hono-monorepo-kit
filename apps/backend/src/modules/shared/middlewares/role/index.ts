import { TRole } from "@repo/shared/types"
import { UnauthorizedError } from "@server/lib/errors"
import { Context } from "hono"
import { createMiddleware } from "hono/factory"
import { TAuthMiddlewareContextWithVariables } from "../auth"

export const honoRoleMiddleware = (roles: TRole[]) => {
    const middleware = createMiddleware(async (c: Context<TAuthMiddlewareContextWithVariables>, next) => {
        const session = c.var.session
        if (!session) {
            throw new UnauthorizedError({ message: 'No session found' })
        }
        if (roles.includes(session.role)) {
            await next()
        } else {
            throw new UnauthorizedError({ message: 'you are not authorized to access this resource', toast: true })
        }
    })
    return middleware
}