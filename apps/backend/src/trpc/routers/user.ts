import { SahredEnums } from "@repo/shared/enums";
import { userRepository, userService } from "@server/bootstrap";
import { EnumCookieKeys } from "@server/lib/enums";
import { CreateUserUseCase } from "@server/modules/application/use-cases/user/CreateUserUseCase";
import { setCookie } from "hono/cookie";
import z from "zod";
import { createTRPCRouter, ownerProcedure, protectedProcedure, publicProcedure, roleMiddleware } from "../init";
import { userValidator } from "@repo/shared/userInsertSchema";
import { ForbiddenError, NotFoundError } from "@server/lib/errors";

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
        }),

    // Owner CRUD operations
    getAllUsers: ownerProcedure
        .use(roleMiddleware([SahredEnums.Role.OWNER]))
        .input(userValidator.userPaginationQuerySchema)
        .query(async ({ ctx, input }) => {
            return await userRepository.getAllUsersWithPagination(input, ctx.companyId)
        }),

    getUserById: protectedProcedure
        .use(roleMiddleware([SahredEnums.Role.OWNER]))
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const user = await userRepository.getUserById(input.id)
            if (!user) {
                throw new NotFoundError({ message: 'User not found', toast: true })
            }
            // Check if user belongs to the same company
            if (user.companyId !== ctx.companyId) {
                throw new ForbiddenError({ message: 'You can only view users from your company', toast: true })
            }
            const { password, ...userWithoutPassword } = user
            return userWithoutPassword
        }),

    updateUser: ownerProcedure
        .use(roleMiddleware([SahredEnums.Role.OWNER]))
        .input(userValidator.updateUserByIdSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await userRepository.getUserById(input.id)
            if (!user) {
                throw new NotFoundError({ message: 'User not found', toast: true })
            }
            // Check if user belongs to the same company
            if (user.companyId !== ctx.companyId) {
                throw new ForbiddenError({ message: 'You can only update users from your company', toast: true })
            }
            // Prevent updating OWNER or ADMIN roles
            if (user.role === SahredEnums.Role.OWNER || user.role === SahredEnums.Role.ADMIN) {
                throw new ForbiddenError({ message: 'You cannot update admin or owner users', toast: true })
            }
            await userRepository.updateUser({ id: input.id, data: input.data })
            return { success: true, message: 'User updated successfully' }
        }),

    deleteUser: ownerProcedure
        .use(roleMiddleware([SahredEnums.Role.OWNER]))
        .input(userValidator.deleteUserByIdSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await userRepository.getUserById(input.id)
            if (!user) {
                throw new NotFoundError({ message: 'User not found', toast: true })
            }
            // Check if user belongs to the same company
            if (user.companyId !== ctx.companyId) {
                throw new ForbiddenError({ message: 'You can only delete users from your company', toast: true })
            }
            // Prevent deleting OWNER or ADMIN roles
            if (user.role === SahredEnums.Role.OWNER || user.role === SahredEnums.Role.ADMIN) {
                throw new ForbiddenError({ message: 'You cannot delete admin or owner users', toast: true })
            }
            await userRepository.deleteUser(input.id)
            return { success: true, message: 'User deleted successfully' }
        }),

    createUserAsOwner: ownerProcedure
        .use(roleMiddleware([SahredEnums.Role.OWNER]))
        .input(userValidator.ownerCreateUserSchema)
        .mutation(async ({ ctx, input }) => {
            const userInput = {
                ...input,
                companyId: ctx.companyId,
                role: SahredEnums.Role.USER,
            }
            return await createUserUseCase.executeAsUser(userInput)
        }),
})