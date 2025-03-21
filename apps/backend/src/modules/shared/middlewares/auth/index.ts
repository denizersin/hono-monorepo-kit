import { EnumHeaderKeys } from "@server/lib/enums"
import { tryCatch, tryCatchSync } from "@server/lib/utils"
import { AuthService } from "@server/modules/application/services/auth/Auth"
import db from "@server/modules/infrastructure/database"
import { TDB } from "@server/modules/infrastructure/database"
import { UserRepositoryImpl } from "@server/modules/infrastructure/repositories/user/UserRepositoryImpl"
import { SahredEnums } from "@repo/shared/enums"
import { TSession } from "@repo/shared/types"
import { createMiddleware } from "hono/factory"
import { AuthenticationError, handleError } from "@server/lib/errors"

export const honoAuthMiddleware = createMiddleware<{
    Variables: {
        authMiddlewareContext: TAuthMiddlewareContext
    }
}>(async (c, next) => {
    try {
        const token = c.req.header(EnumHeaderKeys.AUTHORIZATION) || ''
        const authMiddlewareContext = await createAuthContextForMiddleware({
            authToken: token
        })
        c.set('authMiddlewareContext', authMiddlewareContext)
        await next()
    } catch (error) {
        return handleError(c, error)
    }
})

const createAuthContextForMiddleware = async ({
    authToken
}: {
    authToken: string
}): Promise<TAuthMiddlewareContext> => {
    const userRepository = new UserRepositoryImpl()
    const authService = new AuthService(userRepository)

    const { data: session, error: err } = tryCatchSync(() => authService.verifyToken(authToken))
    
    if (err) {
        throw new AuthenticationError('Invalid token')
    }

    return {
        session
    }
}

export const honoPublicMiddleware = createMiddleware<{
    Variables: {
        publicMiddlewareContext: TPublicMiddlewareContext
    }
}>(async (c, next) => {
    try {
        const publicMiddlewareContext = createPublicMiddleware()
        c.set('publicMiddlewareContext', publicMiddlewareContext)
        await next()
    } catch (error) {
        return handleError(c, error)
    }
})

const createPublicMiddleware = () => {
    return {
        db
    }
}

export type TPublicMiddlewareContext = {
    db: TDB
}

export type TAuthMiddlewareContext = {
    session: TSession
}

