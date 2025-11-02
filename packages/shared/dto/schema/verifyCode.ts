import { boolean, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { getDefaultTableFieldsWithDeletedAt } from './schemaHelpers';



export const tblVerifyCode = pgTable('verify_code', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    code: integer('code').notNull(),
    isMobile: boolean('is_mobile').default(false),
    isMail: boolean('is_mail').default(false),
    generatedForPhoneOrMail: varchar('generated_for_phone_or_mail', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at').notNull(), 

    ...getDefaultTableFieldsWithDeletedAt(),
});

export namespace TSchemaVerifyCode {
    export type TTblVerifyCodeSelect = typeof tblVerifyCode.$inferSelect;
    export type TTblVerifyCodeInsert = typeof tblVerifyCode.$inferInsert;
}