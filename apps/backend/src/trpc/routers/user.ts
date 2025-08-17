import { SahredEnums } from "@repo/shared/enums";
import { userService } from "@server/bootstrap";
import { EnumCookieKeys } from "@server/lib/enums";
import { CreateUserUseCase } from "@server/modules/application/use-cases/user/CreateUserUseCase";
import { setCookie } from "hono/cookie";
import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";

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

    createUser: protectedProcedure
        .input(z.any())
        .mutation(async ({ ctx, input }) => {
            
        })
})