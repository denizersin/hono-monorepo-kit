import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { tblCompany } from "./company";

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

// we will relate translations to tblLanguage.id not tblCompany.language.id
// this is just to know which language is used in the company
// Sonra junction/pivot tablo
export const tblCompanyLanguage = pgTable('company-language', {
    id: serial('id').primaryKey(),
    languageId: integer('language_id').notNull().references(() => tblLanguage.id),
    companyId: integer('company_id').notNull().references(() => tblCompany.id),
});

// En son relations
export const tblCompanyLanguageRelations = relations(tblCompanyLanguage, ({ one }) => ({
    language: one(tblLanguage, {
        fields: [tblCompanyLanguage.languageId],
        references: [tblLanguage.id],
    }),
    company: one(tblCompany, {
        fields: [tblCompanyLanguage.companyId],
        references: [tblCompany.id],
    }),
}));


export namespace TSchemaData {
    export type TTblCountry = typeof tblCountry.$inferSelect
    export type TTblCountryInsert = typeof tblCountry.$inferInsert
    export type TTblLanguage = typeof tblLanguage.$inferSelect
    export type TTblLanguageInsert = typeof tblLanguage.$inferInsert


    export type TTblCompanyLanguage = typeof tblCompanyLanguage.$inferSelect
    export type TTblCompanyLanguageInsert = typeof tblCompanyLanguage.$inferInsert
}
