import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { SahredEnums } from '../../../enums';
import type { TSchemaUser } from '../../schema';
import { tblRolePermission, tblUser } from '../../schema';
import { basePaginationQuerySchema } from '../utils';

const rolePermissionBaseSelectSchema = createSelectSchema(tblRolePermission)
const rolePermissionBaseInsertSchema = createInsertSchema(tblRolePermission, {
    permissionId: z.number(),
    roleId: z.number(),
})

const createBulkRolePermissionSchema = z.object({
    roleId: z.number(),
    permissionIds: z.array(z.number()),
})

const rolePermissionPaginationQuerySchema = basePaginationQuerySchema.extend({
    sort: z.array(z.object({
        sortBy: z.enum(['asc', 'desc']),
        sortField: z.enum(['roleId', 'permissionId', 'createdAt']), // Assuming you might want to sort by these
    })).optional(),
    filter: z.object({
        roleId: z.number().optional(),
        permissionId: z.number().optional(),
    }).optional()
})

const deleteRolePermissionSchema = z.object({
    roleId: z.number(),
    permissionId: z.number(),
})


const userBaseSelectSchema = createSelectSchema(tblUser)

const userBaseInsertSchema = createInsertSchema(tblUser, {
    roleId: z.number(),
    password: z.string().min(8)
})




const adminCreateUserSchema = userBaseInsertSchema.extend({
    test1: z.string().optional()
})




const userCreateSchema = userBaseInsertSchema.omit({
    roleId: true,
}).extend({
    userField: z.string().optional()
})




const createUserSchema = z.discriminatedUnion("role", [
    z.object({ role: z.literal(SahredEnums.ROLE_KEY.USER), data: userCreateSchema }),
    z.object({ role: z.literal(SahredEnums.ROLE_KEY.ADMIN), data: adminCreateUserSchema }),
]);



const loginEmailAndPasswordSchema = userBaseSelectSchema.pick({
    email: true,
    password: true,
})


const userPreferencesSchema = z.object({
    language: z.enum(SahredEnums.getMapKeysForZod(SahredEnums.LANGUAGE_MAP)),
    theme: z.enum(SahredEnums.getMapKeysForZod(SahredEnums.THEME_MAP))
})

const ownerCreateUserSchema = userBaseInsertSchema.omit({
    roleId: true,
    companyId: true,
}).extend({
    role: z.literal(SahredEnums.ROLE_MAP.USER).default(SahredEnums.ROLE_MAP.USER),
})

// Owner update user schema
const ownerUpdateUserSchema = userBaseInsertSchema.omit({
    roleId: true,
    companyId: true,
    password: true,
}).partial()

// Pagination query schema for users
type TUserSortKeys = keyof Pick<TSchemaUser.TTblUserSelect, 'name' | 'email' | 'createdAt'>
const userPaginationSortFields = ['name', 'email', 'createdAt'] as TUserSortKeys[]

const userPaginationQuerySchema = basePaginationQuerySchema.extend({
    sort: z.array(z.object({
        sortBy: z.enum(['asc', 'desc']),
        sortField: z.enum(userPaginationSortFields as [TUserSortKeys, ...TUserSortKeys[]]),
    })),
    filter: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        roleId: z.number().optional(),
    })
})

// Update user by id schema
const updateUserByIdSchema = z.object({
    id: z.number(),
    data: ownerUpdateUserSchema,
})

// Delete user by id schema
const deleteUserByIdSchema = z.object({
    id: z.number(),
})


export const userValidator = {
    userBaseSelectSchema,
    userBaseInsertSchema,
    adminCreateUserSchema,
    createUserSchema,
    loginEmailAndPasswordSchema,
    userCreateSchema,
    userPreferencesSchema,
    ownerCreateUserSchema,
    ownerUpdateUserSchema,
    userPaginationQuerySchema,
    updateUserByIdSchema,
    deleteUserByIdSchema,
    rolePermissionBaseSelectSchema,
    rolePermissionBaseInsertSchema,
    rolePermissionPaginationQuerySchema,
    deleteRolePermissionSchema,
    createBulkRolePermissionSchema,
}







export namespace TUserValidator {
    //types infered from schema
    // dont infer with zod-drizzle(its infer two times bad practise for ts server).
    export type TblUserSelect = TSchemaUser.TTblUserSelect
    export type TblUserInsert = TSchemaUser.TTblUserInsert

    //types infered from zod schemas
    export type TAdminCreateUserSchema = z.infer<typeof adminCreateUserSchema>;
    export type TUserCreateSchema = z.infer<typeof userCreateSchema>;
    export type TCreateUserSchema = z.infer<typeof createUserSchema>;
    export type TLoginEmailAndPasswordSchema = z.infer<typeof loginEmailAndPasswordSchema>;
    export type TOwnerCreateUserSchema = z.infer<typeof ownerCreateUserSchema>;
    export type TOwnerUpdateUserSchema = z.infer<typeof ownerUpdateUserSchema>;
    export type TUserPaginationQuery = z.infer<typeof userPaginationQuerySchema>;
    export type TUserPaginationQuerySortKeys = TUserSortKeys;
    export type TUpdateUserByIdSchema = z.infer<typeof updateUserByIdSchema>;
    export type TDeleteUserByIdSchema = z.infer<typeof deleteUserByIdSchema>;

    export type TRolePermissionSelect = z.infer<typeof rolePermissionBaseSelectSchema>;
    export type TRolePermissionInsert = z.infer<typeof rolePermissionBaseInsertSchema>;
    export type TRolePermissionPaginationQuery = z.infer<typeof rolePermissionPaginationQuerySchema>;
    export type TDeleteRolePermissionSchema = z.infer<typeof deleteRolePermissionSchema>;
    export type TCreateBulkRolePermissionSchema = z.infer<typeof createBulkRolePermissionSchema>;
}



