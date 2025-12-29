import { authValidator } from "@repo/shared/validators";
import { authService } from "@server/bootstrap";
import { EnumCookieKeys } from "@server/lib/enums";
import { createTRPCError } from "@server/lib/errors";
import {
    deleteCookie,
    setCookie
} from 'hono/cookie';
import z from "zod";
import { createTRPCRouter, publicProcedure } from "../init";
import { getApiContext } from "@server/lib/context";
import { EventBus } from "@server/modules/application/event";
import { ENUM_USER_EVENTS } from "@server/modules/application/event/interface/user";


export const authRouter = createTRPCRouter({
    getSession: publicProcedure
        .query(async ({ ctx }) => {
            if (!ctx.session) {
                throw createTRPCError({
                    code: 'UNAUTHORIZED',
                })
            }

            const apiContext = getApiContext();
            console.log('11')

            return ctx.session
        }),



    login: publicProcedure.input(authValidator.loginEmailAndPasswordFormSchema).mutation(async ({ ctx, input }) => {
        const result = await authService.login(input)
        setCookie(ctx.c, EnumCookieKeys.SESSION, result.token)
        return result
    }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
        deleteCookie(ctx.c, EnumCookieKeys.SESSION)
        return {
            message: 'Logged out'
        }
    }),
    register: publicProcedure.input(authValidator.registerFormSchema).mutation(async ({ ctx, input }) => {
        const result = await authService.registerWithOtp(input)
        return result
    }),
    verifyCode: publicProcedure.input(authValidator.verifyCodeFormSchema).mutation(async ({ ctx, input }) => {
        const result = await authService.verifyCode(input)
        setCookie(ctx.c, EnumCookieKeys.SESSION, result.token)
        return result
    }),

    resendVerificationCode: publicProcedure.input(authValidator.registerFormSchema).mutation(async ({ ctx, input }) => {
        const result = await authService.resendVerificationCode(input)
        return result
    }),

    getSessionWithToken: publicProcedure.input(z.object({
        token: z.string()
    })).query(async ({ ctx, input }) => {
        const result = await authService.verifyToken(input.token)
        return result
    }),
})
