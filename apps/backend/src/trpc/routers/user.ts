import { SahredEnums } from "@repo/shared/enums";
import { userService } from "@server/bootstrap";
import { EnumCookieKeys } from "@server/lib/enums";
import { CreateUserUseCase } from "@server/modules/application/use-cases/user/CreateUserUseCase";
import { setCookie } from "hono/cookie";
import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure, roleMiddleware } from "../init";
import { userValidator } from "@repo/shared/userInsertSchema";
import { ForbiddenError } from "@server/lib/errors";

const createUserUseCase = new CreateUserUseCase(userService)






export const userRouter = createTRPCRouter({

    getUserPreferences: publicProcedure.query(async ({ ctx }) => {
        return {
            language: ctx.language,
            theme: ctx.theme
        }
    }),

    updateUserPreferences: publicProcedure.input(z.object({
        language: z.nativeEnum(SahredEnums.Language),
        theme: z.nativeEnum(SahredEnums.Theme)
    })).mutation(async ({ ctx, input }) => {
        setCookie(ctx.c, EnumCookieKeys.LANGUAGE, input.language)
        setCookie(ctx.c, EnumCookieKeys.THEME, input.theme)
        return {
            message: 'User preferences updated'
        }
    }),

    createUser: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(z.union([userValidator.adminCreateUserSchema, userValidator.userCreateSchema]))
        .mutation(async ({ ctx, input }) => {
            if (ctx.session.role === SahredEnums.Role.ADMIN) {
                const adminCreateUserInput = userValidator.adminCreateUserSchema.parse(input)
                return await createUserUseCase.executeAsAdmin(adminCreateUserInput)
            }
            else if (ctx.session.role === SahredEnums.Role.OWNER) {
                const userCreateUserInput = userValidator.userCreateSchema.parse(input)
                return await createUserUseCase.executeAsUser(userCreateUserInput)
            }
            else {
                throw new ForbiddenError({ message: 'you are not authorized to create a user', toast: true })
            }
        })
})