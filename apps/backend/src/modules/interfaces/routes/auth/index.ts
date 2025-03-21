import { zValidator } from "@hono/zod-validator"
import { TUserValidator } from "@repo/shared/userInsertSchema"
import { authValidator } from "@repo/shared/validators"
import { createSuccessResponse, handleError } from "@server/lib/errors"
import { AuthService } from "@server/modules/application/services/auth/Auth"
import { UserRepositoryImpl } from "@server/modules/infrastructure/repositories/user/UserRepositoryImpl"
import { TPublicMiddlewareContext } from "@server/modules/shared/middlewares/auth"
import { Hono } from "hono"
import { z } from "zod"
import { SahredEnums } from "@repo/shared/enums"
import { TRole, TSession } from "@repo/shared/types";

// import {  } from "@repo/shared/dto/validators/auth"


const authApp = new Hono<{
    Variables: {
        publicMiddlewareContext: TPublicMiddlewareContext
    }
}>()
    .get('/', (c) => {
        return c.json(createSuccessResponse({
            messageFromAuth: 'Helqwelo from Hon o2 123!',
        }))
    })
    .post('/login',
        zValidator('json', authValidator.loginEmailAndPasswordFormSchema),
        async (c) => {
            try {
                const body = c.req.valid('json')
                const userRepository = new UserRepositoryImpl()
                const authService = new AuthService(userRepository)
                const result = await authService.login(body)



                return c.json(createSuccessResponse(result))
                // return c.json(createSuccessResponse({
                //     test:SahredEnums.Role
                // }))
            } catch (error) {
                return handleError(c, error)
            }
        })
    .post('/register',
        zValidator('json', z.object({
            email: z.string().email(),
            password: z.string().min(8),
            name: z.string().min(2),
        })),
        async (c) => {
            try {
                const body = await c.req.json() as TUserValidator.TUserCreateSchema
                const userRepository = new UserRepositoryImpl()
                const authService = new AuthService(userRepository)
                const result = await authService.register(body)
                return c.json(createSuccessResponse(result))
            } catch (error) {
                return handleError(c, error)
            }
        })

export default authApp