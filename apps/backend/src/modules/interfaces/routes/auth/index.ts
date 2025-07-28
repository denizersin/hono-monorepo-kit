import { zValidator } from "@hono/zod-validator"
import { authValidator } from "@repo/shared/validators"
// import { context } from "@server/index"
import { EnumCookieKeys } from "@server/lib/enums"
import { AuthenticationError, createSuccessResponse } from "@server/lib/errors"
import { createHonoApp } from "@server/lib/hono/hono-factory"
import { tryCatchSync } from "@server/lib/utils"
import { AuthService } from "@server/modules/application/services/auth/Auth"
import { WhatsappService } from "@server/modules/application/services/whatsapp"
import { CountryRepository } from "@server/modules/infrastructure/repositories/data/CountryRepository"
import { UserRepositoryImpl } from "@server/modules/infrastructure/repositories/user/UserRepositoryImpl"
import { VerifyCodeRepositoryImpl } from "@server/modules/infrastructure/repositories/verifyCode/VerifyCodeRepositoryImpl"
import {
    deleteCookie,
    setCookie
} from 'hono/cookie'
import { z } from "zod"

const userRepository = new UserRepositoryImpl()
const wpClientService = new WhatsappService()
const countryRepository = new CountryRepository()
const verifyCodeRepository = new VerifyCodeRepositoryImpl()

const authService = new AuthService(userRepository, wpClientService, countryRepository, verifyCodeRepository)


const authApp = createHonoApp()
    .get('/get-session',
        async (c) => {


            const session = c.var.session

            if (!session) {
                throw new AuthenticationError({ message: 'No session found', })
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
            const result = await authService.login(body)

            setCookie(c, EnumCookieKeys.SESSION, result.token)
            return c.json(createSuccessResponse(result))

        }).post('/register',
            zValidator('json', authValidator.registerFormSchema),
            async (c) => {

                const body = c.req.valid('json')
                const result = await authService.registerWithOtp(body)
                // setCookie(c, EnumCookieKeys.SESSION, result.token)
                return c.json(createSuccessResponse(result))


            })
    .get('/get-session-with-token',

        zValidator('query', z.object({
            token: z.string()
        })),
        async (c) => {
            const sessionToken = c.req.valid('query').token

            const { data: session, error: err } = tryCatchSync(() => authService.verifyToken(sessionToken))
            if (err) {
                throw new AuthenticationError({ message: 'Invalid token', })
            }
            return c.json(createSuccessResponse(session))
        })
    .post('/verify-code',
        zValidator('json', authValidator.verifyCodeFormSchema),
        async (c) => {
            const body = c.req.valid('json')
            const result = await authService.verifyCode(body)
            setCookie(c, EnumCookieKeys.SESSION, result.token)
            return c.json(createSuccessResponse(result))
        })

export default authApp