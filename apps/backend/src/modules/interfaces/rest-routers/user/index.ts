import { zValidator } from "@hono/zod-validator"
import { SahredEnums } from "@repo/shared/enums"
import { TUserValidator, userValidator } from "@repo/shared/userInsertSchema"
import { validateMultipleSchemas } from "@repo/shared/utils"
import { EnumCookieKeys } from "@server/lib/enums"
import { createSuccessResponse, ForbiddenError } from "@server/lib/errors"
import { apiContext, createHonoApp } from "@server/lib/hono/hono-factory"
import { wait } from "@server/lib/utils"
import { UserService } from "@server/modules/application/services/user/UserService"
import { CreateUserUseCase } from "@server/modules/application/use-cases/user/CreateUserUseCase"
import { UserRepositoryImpl } from "@server/modules/infrastructure/repositories/user/UserRepositoryImpl"
import { honoAuthMiddleware, TAuthMiddlewareContextWithVariables } from "@server/modules/shared/middlewares/auth"
import { honoRoleMiddleware } from "@server/modules/shared/middlewares/role"
import { Context } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { validator } from "hono/validator"



const userService = new UserService(new UserRepositoryImpl())
const createUserUseCase = new CreateUserUseCase(userService)

const userApp = createHonoApp()
    .use(honoAuthMiddleware)
    .get('/',
        (c) => {
            return c.json({
                message: 'Hello from Hono!',
            })
        })
    .get('/me',
        async (c) => {
            // const store = context.getStore()
            // console.log(store?.session?.user.email,'store')

            const store = apiContext.getStore()
            await wait(1000)
            const db = c.var.db
            const sesion = c.var.session
            // const users =await db.query.tblUser.findMany()
            return c.json(createSuccessResponse({
                message: 'Hello from Hono!',
                // users,
                sesion
            }))
        })
    .get('/with-id/:id', async (c) => {
        const id = c.req.param('id')
        return c.json({
            message: 'Hello from Hono!',
            id
        })
    })
    .get('get-preferences', async (c) => {
        // const language = c.var.language
        const language = getCookie(c, EnumCookieKeys.LANGUAGE)
        const theme = getCookie(c, EnumCookieKeys.THEME)
        return c.json({
            language,
            theme
        })
    })
    .post('update-preferences',
        zValidator('json', userValidator.userPreferencesSchema),
        async (c) => {
            const language = c.req.valid('json').language
            const theme = c.req.valid('json').theme
            setCookie(c, EnumCookieKeys.LANGUAGE, language)
            setCookie(c, EnumCookieKeys.THEME, theme)
            return c.json({
                message: 'Hello from Hono!',
                language,
                theme
            })
        })
    .post('/create-user',
        honoRoleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.USER]),
        validator('json', async (value, c: Context<TAuthMiddlewareContextWithVariables>) => {
            const role = c.var.session.role
            return validateMultipleSchemas({
                map: {
                    [SahredEnums.Role.ADMIN]: userValidator.adminCreateUserSchema,
                    [SahredEnums.Role.USER]: userValidator.userCreateSchema
                },
                key: role,
                data: value
            })

        }),
        async (c) => {
            const userData = c.req.valid('json')
            const session = c.var.session

            if (session.role == SahredEnums.Role.ADMIN) {
                const result = await createUserUseCase.executeAsAdmin(userData as TUserValidator.TAdminCreateUserSchema)
                return c.json(createSuccessResponse(result))
            } else if (session.role == SahredEnums.Role.USER) {
                const result = await createUserUseCase.executeAsUser(userData as TUserValidator.TUserCreateSchema)
                return c.json(createSuccessResponse(result))
            } else {
                throw new ForbiddenError({ message: 'you are not authorized to create a user', toast: true })
            }


        })




userApp.get('/', (c) => {

    const users = c.var.db.query.tblUser.findMany()
    return c.json({
        message: 'Hello from Hono!',
        users
    })
})




export default userApp