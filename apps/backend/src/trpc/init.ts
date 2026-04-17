import { SahredEnums } from "@repo/shared/enums";
import { createTRPCError, TErrorResponse, TRPC_ERROR_CODES_BY_KEY } from "@server/lib/errors";
import { AppBindings } from "@server/lib/hono/types";
import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "hono";
import superjson from "superjson";
import { ZodError } from "zod";



type TRPCContext = AppBindings['Variables'] & {
    c: Context<AppBindings>
}

export const createTRPCContext = async (c: Context<AppBindings>) => {
    return {
        session: c.var.session,
        companyId: c.var.companyId,
        db: c.var.db,
        language: c.var.language,
        theme: c.var.theme,
        c: c
    }
}


const t = initTRPC.context<TRPCContext>().create({
    transformer: superjson,
    errorFormatter(opts) {
        const { shape, error } = opts;


        const causeData = ((error.cause as any)?.customData) as TErrorResponse['errors'][number] | undefined



        //!important: if we throw an error that instance of appError(not trpc or createTrpcError), we need to set the http status and code otherwise it will always be 500
        if (causeData && !causeData.isFromTrpcErrorInstance) {
            shape.data.httpStatus = causeData.statusCode
            shape.code = TRPC_ERROR_CODES_BY_KEY[causeData.errorCode]
        }



        return {
            ...shape,
            // code: TRPC_ERROR_CODES_BY_KEY['BAD_REQUEST'],
            data: {
                ...shape.data,
                zodError:
                    error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,

                causeData: {
                    ...causeData,

                    //!important: we need to override the name otherwise it will not transfomr correct data
                    name: ''
                }


            },

        };

    },
})

export type TTrpcErrorServer = typeof t['_config']['$types']['errorShape']



export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory




export const publicProcedure = t.procedure.use(async (opts) => {
    // const ctx = await createTRPCContext(opts.ctx)
    return opts.next({
        ctx: opts.ctx
    })
})




export const protectedProcedure = t.procedure.use(async (opts) => {
    if (!opts.ctx.session) {
        throw createTRPCError({
            code: 'UNAUTHORIZED',
        })
    }
    return opts.next({
        ctx: {
            ...opts.ctx,
            session: opts.ctx.session,
            companyId: opts.ctx.companyId!
        }
    })
})


export const adminProcedure = protectedProcedure.use(async (opts) => {
    if (opts.ctx.session.role !== SahredEnums.ROLE_KEY.ADMIN) {
        throw createTRPCError({
            code: 'UNAUTHORIZED',
        })
    }
    return opts.next({
        ctx: {
            ...opts.ctx,
            session: opts.ctx.session
        }
    })
})


export const ownerProcedure = protectedProcedure.use(async (opts) => {
    if (opts.ctx.session.role !== SahredEnums.ROLE_KEY.OWNER) {
        throw createTRPCError({
            code: 'UNAUTHORIZED',
        })
    }
    return opts.next({
        ctx: {
            ...opts.ctx,
            session: opts.ctx.session,
            companyId: opts.ctx.companyId!
        }
    })
})





export const roleMiddleware = (requiredRoleIds: number[] | number) =>
    t.middleware(({ ctx, next }) => {
        if (!ctx.session) {
            throw createTRPCError({
                code: 'UNAUTHORIZED',
                data: {
                    toast: true,
                    message: 'You are not authorized to access this resource'
                }
            });
        }
        if (Array.isArray(requiredRoleIds) && !requiredRoleIds.includes(ctx.session.roleId)) {
            throw createTRPCError({
                code: 'UNAUTHORIZED',
                data: {
                    toast: true,
                    message: 'You are not authorized to access this resource'
                }
            });
        }
        if (typeof requiredRoleIds === 'number' && ctx.session.roleId !== requiredRoleIds) {
            throw createTRPCError({
                code: 'UNAUTHORIZED',
                data: {
                    toast: true,
                    message: 'You are not authorized to access this resource'
                }
            });
        }
        return next();
    });






