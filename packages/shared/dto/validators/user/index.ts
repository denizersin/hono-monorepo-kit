import { SahredEnums } from '../../../enums';
import { tblUser } from '../../schema';
import type { TSchemaUser } from '../../schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';


const userBaseSelectSchema = createSelectSchema(tblUser,{
    role: z.enum(SahredEnums.getEnumValuesForZod(SahredEnums.Role))
})

const userBaseInsertSchema = createInsertSchema(tblUser, {
    role: z.enum(SahredEnums.getEnumValuesForZod(SahredEnums.Role)),
    password: z.string().min(8)
})  




const adminCreateUserSchema = userBaseInsertSchema.omit({
})




const userCreateSchema = userBaseInsertSchema.omit({
    role: true,
})


const loginEmailAndPasswordSchema = userBaseSelectSchema.pick({
    email: true,
password: true,
})


const userPreferencesSchema = z.object({
    language: z.enum(SahredEnums.getEnumValuesForZod(SahredEnums.Language)),
    theme: z.enum(SahredEnums.getEnumValuesForZod(SahredEnums.Theme))
})




export const userValidator = {
    userBaseSelectSchema,
    userBaseInsertSchema,
    adminCreateUserSchema,
    loginEmailAndPasswordSchema,
    userCreateSchema,
    userPreferencesSchema
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
}



