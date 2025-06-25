import { boolean, float, int, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import type { TMailConfirmationStatus, TRole } from '../../types';
import { SahredEnums } from '../../enums/index';

export const tblUser = mysqlTable('user', {
    id: int('id').primaryKey().autoincrement(),
    companyId: int('company_id').notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    surname: varchar('surname', { length: 255 }).notNull(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    phoneCodeId: int('phone_code_id').notNull(),
    phoneNumber: varchar('phone_number', { length: 255 }).notNull(),
    wallet: float('wallet').notNull().default(0),
    totalReward: float('totalReward').notNull().default(0),
    invitationCode: varchar('invitation_code', { length: 255 }).notNull(),
    refCode: varchar('ref_code', { length: 255 }),
    fullPhone: varchar('full_phone', { length: 255 }).notNull(),
    
    role: mysqlEnum('role',SahredEnums.getEnumValuesForZod(SahredEnums.Role)),
    test: varchar('test', { length: 255 }).notNull(),
    mailConfirmationStatusId: int('mail_confirmation_status_id').notNull(),
    phoneVerificationCodeSendAt: timestamp('phone_verification_code_send_at'),
    isPhoneVerified: boolean('is_phone_verified').notNull().default(false),
    // testTyped: varchar('test_typed', { length: 255 }).notNull().$type<TRole>(),
});

export const tblRole = mysqlTable('role', {
    id: int('id').primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull().$type<TMailConfirmationStatus>(),
});


export const tblMailConfirmationStatus = mysqlTable('mail_confirmation_status', {
    id: int('id').primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull().$type<TMailConfirmationStatus>(),
});






export namespace TSchemaUser {
    export type TTblUserSelect = typeof tblUser.$inferSelect;
    export type TTblUserInsert = typeof tblUser.$inferInsert;

    export type TTblRoleSelect = typeof tblRole.$inferSelect;
    export type TTblRoleInsert = typeof tblRole.$inferInsert;

    export type TTblMailConfirmationStatusSelect = typeof tblMailConfirmationStatus.$inferSelect;
    export type TTblMailConfirmationStatusInsert = typeof tblMailConfirmationStatus.$inferInsert;
}

