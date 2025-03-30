import { TSession } from "@repo/shared/types"
import { EnumCookieKeys, EnumHeaderKeys } from "@server/lib/enums"
import { AuthenticationError, handleAppError } from "@server/lib/errors"
import { tryCatchSync } from "@server/lib/utils"
import { AuthService } from "@server/modules/application/services/auth/Auth"
import db, { TDB } from "@server/modules/infrastructure/database"
import { UserRepositoryImpl } from "@server/modules/infrastructure/repositories/user/UserRepositoryImpl"
import { createMiddleware } from "hono/factory"
import {
    getCookie,
    getSignedCookie,
    setCookie,
    setSignedCookie,
    deleteCookie,
} from 'hono/cookie'

export const honoAuthMiddleware = createMiddleware<{
    Variables: {
        authMiddlewareContext: TAuthMiddlewareContext
    }
}>(async (c, next) => {
    // const token = c.req.header(EnumHeaderKeys.AUTHORIZATION) || ''
    const sessionToken = getCookie(c, EnumCookieKeys.SESSION) || ''
    const authMiddlewareContext = await createAuthContextForMiddleware({
        authToken: sessionToken
    })
    c.set('authMiddlewareContext', authMiddlewareContext)
    await next()
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
        throw new AuthenticationError({message: 'Invalid token'})
    }

    return {
        session
    }
}





//we use createFactory instead of publicMiddlewareContext 

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
        return handleAppError(c, error)
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

