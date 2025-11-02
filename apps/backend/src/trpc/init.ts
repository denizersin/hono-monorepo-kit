import { SahredEnums } from "@repo/shared/enums";
import { TRole } from "@repo/shared/types";
import { TErrorResponse, TRPC_ERROR_CODES_BY_KEY } from "@server/lib/errors";
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


        const causeData = (error.cause || (error.cause as any)?.customData) as TErrorResponse['errors'][number] | undefined


        //!important: if we throw an error that instance of appError(not trpc or createTrpcError), we need to set the http status and code otherwise it will always be 500
        if (causeData && !causeData.isFromTrpcErrorInstance) {
            shape.data.httpStatus = causeData.statusCode
            shape.code = TRPC_ERROR_CODES_BY_KEY[causeData.errorCode]
        }


        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,

                causeData: {
                    ...causeData,

                    //!important: we need to override the name otherwise it will not transfomr correct data
                    name:''
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
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Unauthorized'
        })
    }
    return opts.next({
        ctx: {
            ...opts.ctx,
            session: opts.ctx.session
        }
    })
})


export const adminProcedure = protectedProcedure.use(async (opts) => {
    if (opts.ctx.session.role !== SahredEnums.Role.ADMIN) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Unauthorized'
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
    if (opts.ctx.session.role !== SahredEnums.Role.OWNER) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Unauthorized'
        })
    }
    return opts.next({
        ctx: {
            ...opts.ctx,
            session: opts.ctx.session
        }
    })
})





export const roleMiddleware = (requiredRoles: TRole[] | TRole) =>
    t.middleware(({ ctx, next }) => {
        if (!ctx.session) {
            throw new Error('Not authenticated');
        }
        if (Array.isArray(requiredRoles) && !requiredRoles.includes(ctx.session.role)) {
            throw new Error('Unauthorized');
        }
        if (typeof requiredRoles === 'string' && ctx.session.role !== requiredRoles) {
            throw new Error('Unauthorized');
        }
        return next();
    });






