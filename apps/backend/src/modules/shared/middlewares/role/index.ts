import { TRole } from "@repo/shared/types"
import { AuthenticationError } from "@server/lib/errors"
import { Context } from "hono"
import { createMiddleware } from "hono/factory"
import { TAuthMiddlewareContextWithVariables } from "../auth"

export const honoRoleMiddleware = (roles: TRole[]) => createMiddleware(async (c: Context<TAuthMiddlewareContextWithVariables>, next) => {
    const session = c.var.authMiddlewareContext.session
    if (roles.includes(session.role)) {
        await next()
    } else {
        throw new AuthenticationError({ message: 'you are not authorized to access this resource', toast: true })
    }
})