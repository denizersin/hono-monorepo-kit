import { TSession } from "@repo/shared/types"
import { EnumCookieKeys, EnumHeaderKeys } from "@server/lib/enums"
import { AuthenticationError, handleAppError } from "@server/lib/errors"
import { getTokenFromAuthHeader, tryCatchSync } from "@server/lib/utils"
import { AuthService } from "@server/modules/application/services/auth/Auth"
import { WhatsappService } from "@server/modules/application/services/whatsapp"
import { CountryRepository } from "@server/modules/infrastructure/repositories/data/CountryRepository"
import { UserRepositoryImpl } from "@server/modules/infrastructure/repositories/user/UserRepositoryImpl"
import { VerifyCodeRepositoryImpl } from "@server/modules/infrastructure/repositories/verifyCode/VerifyCodeRepositoryImpl"
import { Context } from "hono"
import {
    getCookie
} from 'hono/cookie'
import { createMiddleware } from "hono/factory"

const userRepository = new UserRepositoryImpl()
const wpClientService = new WhatsappService()
const countryRepository = new CountryRepository()
const verifyCodeRepository = new VerifyCodeRepositoryImpl()
const authService = new AuthService(userRepository, wpClientService, countryRepository, verifyCodeRepository)

export type TAuthMiddlewareContextWithVariables = {
    Variables: {
        session: TSession
        companyId: number
    }
}
//Buaradaki contextVar ile type inference yapıyoruz. context'de session|null şeklinde gelecek.
export const honoAuthMiddleware = createMiddleware<TAuthMiddlewareContextWithVariables>(async (c, next) => {


    const session = c.var.session

    if (!session) {
        throw new AuthenticationError({ message: 'No session found' })
    }

    c.set('session', session)
    c.set('companyId', session.companyId)
    await next()
})

export type TAdminAuthMiddlewareContextWithVariables = {
    Variables: {
        session: TSession
        companyId: number
        //test
        adminName: string
    }
}

export const honoAdminAuthMiddleware = createMiddleware<TAdminAuthMiddlewareContextWithVariables>(async (c, next) => {
    const session = c.var.session

    if (!session) {
        throw new AuthenticationError({ message: 'No session found' })
    }
    

    if (session.role !== "ADMIN") {
        throw new AuthenticationError({ message: 'Unauthorized' })
    }

    c.set('session', session)
    c.set('companyId', session.companyId)
    c.set('adminName', session.user.name)
    await next()
})




const createSafeSessionForMiddleware = async ({
    authToken
}: {
    authToken: string
}): Promise<TSession | null> => {


    const { data: session, error: err } = tryCatchSync(() => authService.verifyToken(authToken))

    if (err) {
        return null
    }

    return session
}

export const getSafeSessionFromContext = async (c: Context): Promise<TSession | null> => {

    const sessionCookiToken = getCookie(c, EnumCookieKeys.SESSION) || ''
    const sessionHeaderToken = getTokenFromAuthHeader(c.req.header(EnumHeaderKeys.AUTHORIZATION) || '') || ''

    if (!sessionCookiToken && !sessionHeaderToken) {
        return null
    }
    const sessionToken = sessionCookiToken || sessionHeaderToken!

    const { data: session, error: err } = tryCatchSync(() => authService.verifyToken(sessionToken))

    if (err) {
        return null
    }

    return session
}




//we use createFactory instead of publicMiddlewareContext 

export const honoPublicCompanyMiddleware = createMiddleware<{
    Variables: {
        publicMiddlewareContext: TPublicMiddlewareContext
        companyId: number
    }
}>(async (c, next) => {
    try {
        const session = await getSafeSessionFromContext(c)

        if (session) {
            c.set('companyId', session.companyId)
        }
        const companyId = c.req.header(EnumHeaderKeys.COMPANY_ID)
        if (companyId && parseInt(companyId) > 0) {
            c.set('companyId', parseInt(companyId))
        } else {
            throw new AuthenticationError({ message: 'No company id provided' })
        }
        c.set('publicMiddlewareContext', {})
        await next()
    } catch (error) {
        return handleAppError(c, error)
    }
})



export type TPublicMiddlewareContext = {
}



