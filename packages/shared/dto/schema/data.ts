import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const tblCountry = pgTable('country', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    phoneCode: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 255 }).notNull(),
})


export const tblLanguage = pgTable('language', {
    id: serial('id').primaryKey(), // auto-increment için serial kullandık
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 255 }).notNull(),
});



export namespace TSchemaData {
    export type TTblCountry = typeof tblCountry.$inferSelect
    export type TTblCountryInsert = typeof tblCountry.$inferInsert
    export type TTblLanguage = typeof tblLanguage.$inferSelect
    export type TTblLanguageInsert = typeof tblLanguage.$inferInsert
}
