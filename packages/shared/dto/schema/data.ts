import { relations } from "drizzle-orm";
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const tblCountry = mysqlTable('country', {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
    phoneCode: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 255 }).notNull(),
})


export const tblLanguage = mysqlTable('language', {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 255 }).notNull(),
})




export namespace TSchemaData {
    export type TTblCountry = typeof tblCountry.$inferSelect
    export type TTblCountryInsert = typeof tblCountry.$inferInsert
    export type TTblLanguage = typeof tblLanguage.$inferSelect
    export type TTblLanguageInsert = typeof tblLanguage.$inferInsert
}
