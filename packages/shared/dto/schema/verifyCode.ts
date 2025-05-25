import { boolean, int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { tblUser } from "./user";

export const tblVerifyCode = mysqlTable('verify_code', {
    id: int('id').primaryKey().autoincrement(),
    code: int('code').notNull(),
    isMobile: boolean('is_mobile').default(false),
    isMail: boolean('is_mail').default(false),
    generatedForPhoneOrMail: varchar('generated_for_phone_or_mail', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    expiresAt: timestamp('expires_at').notNull(),
});

export namespace TSchemaVerifyCode {
    export type TTblVerifyCodeSelect = typeof tblVerifyCode.$inferSelect;
    export type TTblVerifyCodeInsert = typeof tblVerifyCode.$inferInsert;
} 