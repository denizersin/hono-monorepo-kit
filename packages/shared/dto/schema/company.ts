import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core"

export const tblCompany = pgTable('company', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    test: boolean().notNull().default(false),
    test2: varchar({ length: 255 }).notNull().default('test'),
    test3: varchar({ length: 255 }).notNull().default('test'),
})




export namespace TSchemaCompany {
    export type TTblCompany = typeof tblCompany.$inferSelect
    export type TTblCompanyInsert = typeof tblCompany.$inferInsert


    export namespace TCompanyRepositoryTypes { 
        export type updateCompanyLanguages = {
            companyId: number
            languages: number[]
        }
    }
}