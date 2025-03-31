import { zValidator } from "@hono/zod-validator"
import { TSession } from "@repo/shared/types"
import { authValidator } from "@repo/shared/validators"
import { EnumCookieKeys } from "@server/lib/enums"
import { AuthenticationError, createErrorResponse, createSuccessResponse } from "@server/lib/errors"
import honoFactory from "@server/lib/hono/hono-factory"
import { tryCatchSync } from "@server/lib/utils"
import { AuthService } from "@server/modules/application/services/auth/Auth"
import { UserRepositoryImpl } from "@server/modules/infrastructure/repositories/user/UserRepositoryImpl"
import {
    deleteCookie,
    getCookie,
    getSignedCookie,
    setCookie,
    setSignedCookie
} from 'hono/cookie'


const authApp = honoFactory.createApp()
    .get('/get-session',
        async (c) => {
            // const authToken = c.req.header(EnumHeaderKeys.AUTHORIZATION) || ''
            const sessionToken = getCookie(c, EnumCookieKeys.SESSION) || ''
            const userRepository = new UserRepositoryImpl()
            const authService = new AuthService(userRepository)
            const { data: session, error: err } = tryCatchSync(() => authService.verifyToken(sessionToken))
            if (err) {
                throw new AuthenticationError({ message: 'Invalid token', })
            }
            return c.json(createSuccessResponse(session))


        })
    .post('/logout',
        async (c) => {
            deleteCookie(c, EnumCookieKeys.SESSION)
            return c.json(createSuccessResponse({}))
        })
    .post('/login',
        zValidator('json', authValidator.loginEmailAndPasswordFormSchema),
        async (c) => {



            const body = c.req.valid('json')
            const userRepository = new UserRepositoryImpl()
            const authService = new AuthService(userRepository)
            const result = await authService.login(body)

            setCookie(c, EnumCookieKeys.SESSION, result.token)
            return c.json(createSuccessResponse(result))

        }).post('/register',
            zValidator('json', authValidator.registerFormSchema),
            async (c) => {

                const body = c.req.valid('json')
                const userRepository = new UserRepositoryImpl()
                const authService = new AuthService(userRepository)
                const result = await authService.register(body)

                setCookie(c, EnumCookieKeys.SESSION, result.token)

                return c.json(createSuccessResponse(result))


            })

export default authApp