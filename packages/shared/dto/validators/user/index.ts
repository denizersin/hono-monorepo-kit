import { SahredEnums } from '../../../enums';
import { tblUser } from '../../schema';
import type { TSchemaUser } from '../../schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { basePaginationQuerySchema, defaultOmitFieldsSchema } from '../utils';


const userBaseSelectSchema = createSelectSchema(tblUser, {
    role: z.enum(SahredEnums.getEnumValuesForZod(SahredEnums.Role))
})

const userBaseInsertSchema = createInsertSchema(tblUser, {
    role: z.enum(SahredEnums.getEnumValuesForZod(SahredEnums.Role)),
    password: z.string().min(8)
})




const adminCreateUserSchema = userBaseInsertSchema.extend({
    test1: z.string().optional()
})




const userCreateSchema = userBaseInsertSchema.omit({
    role: true,
}).extend({
    userField: z.string().optional()
})


const loginEmailAndPasswordSchema = userBaseSelectSchema.pick({
    email: true,
    password: true,
})


const userPreferencesSchema = z.object({
    language: z.enum(SahredEnums.getEnumValuesForZod(SahredEnums.Language)),
    theme: z.enum(SahredEnums.getEnumValuesForZod(SahredEnums.Theme))
})

// Owner creates user schema (limited roles: USER only)
const ownerCreateUserSchema = userBaseInsertSchema.omit({
    role: true,
    companyId: true,
}).extend({
    role: z.literal(SahredEnums.Role.USER).default(SahredEnums.Role.USER),
})

// Owner update user schema
const ownerUpdateUserSchema = userBaseInsertSchema.omit({
    role: true,
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
        role: z.enum(SahredEnums.getEnumValuesForZod(SahredEnums.Role)).optional(),
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
    loginEmailAndPasswordSchema,
    userCreateSchema,
    userPreferencesSchema,
    ownerCreateUserSchema,
    ownerUpdateUserSchema,
    userPaginationQuerySchema,
    updateUserByIdSchema,
    deleteUserByIdSchema,
}







export namespace TUserValidator {
    //types infered from schema
    // dont infer with zod-drizzle(its infer two times bad practise for ts server).
    export type TblUserSelect = TSchemaUser.TTblUserSelect
    export type TblUserInsert = TSchemaUser.TTblUserInsert

    //types infered from zod schemas
    export type TAdminCreateUserSchema = z.infer<typeof adminCreateUserSchema>;
    export type TUserCreateSchema = z.infer<typeof userCreateSchema>;
    export type TLoginEmailAndPasswordSchema = z.infer<typeof loginEmailAndPasswordSchema>;
    export type TOwnerCreateUserSchema = z.infer<typeof ownerCreateUserSchema>;
    export type TOwnerUpdateUserSchema = z.infer<typeof ownerUpdateUserSchema>;
    export type TUserPaginationQuery = z.infer<typeof userPaginationQuerySchema>;
    export type TUserPaginationQuerySortKeys = TUserSortKeys;
    export type TUpdateUserByIdSchema = z.infer<typeof updateUserByIdSchema>;
    export type TDeleteUserByIdSchema = z.infer<typeof deleteUserByIdSchema>;
}



