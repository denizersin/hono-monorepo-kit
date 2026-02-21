import { TPermission } from '#/enums/permissions';
import { TMailConfirmationStatus, TRole } from '#/types/index';
import { boolean, doublePrecision, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { getDefaultTableFields } from './schemaHelpers';


export const tblUser = pgTable('user', {
    id: serial('id').primaryKey(),
    companyId: integer('company_id').notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    surname: varchar('surname', { length: 255 }).notNull(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    phoneCodeId: integer('phone_code_id').notNull(),
    phoneNumber: varchar('phone_number', { length: 255 }).notNull(),
    wallet: doublePrecision('wallet').notNull().default(0),
    totalReward: doublePrecision('totalReward').notNull().default(0),
    invitationCode: varchar('invitation_code', { length: 255 }).notNull(),
    refCode: varchar('ref_code', { length: 255 }),
    fullPhone: varchar('full_phone', { length: 255 }).notNull(),


    roleId: integer('role_id').notNull(),
    test: varchar('test', { length: 255 }).notNull(),
    mailConfirmationStatusId: integer('mail_confirmation_status_id').notNull(),
    phoneVerificationCodeSendAt: timestamp('phone_verification_code_send_at'),
    isPhoneVerified: boolean('is_phone_verified').notNull().default(false),

    ...getDefaultTableFields(),
    deletedAt: timestamp('deleted_at'),
});

export const tblRole = pgTable('roles', {
    id: integer('id').primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull().$type<TRole>(),
});

export const tblPermission = pgTable('permissions', {
    id: integer('id').primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull().$type<TPermission>(),
});

export const tblRolePermission = pgTable('role_permissions', {
    roleId: integer('role_id').notNull().references(() => tblRole.id),
    permissionId: integer('permission_id').notNull().references(() => tblPermission.id),
    ...getDefaultTableFields(),
});



//role only is an enum
// export const tblRole = pgTable('roles', {
//     id: integer('id').primaryKey().notNull(),
//     name: roleEnum('name').notNull(),
// });


export const tblMailConfirmationStatus = pgTable('mail_confirmation_statuses', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().$type<TMailConfirmationStatus>(),
});

// export const moodEnum = pgEnum('mood', SahredEnums.getEnumValues(SahredEnums.MAIL_CONFIRMATION_MAP) as [string, ...string[]]);

// export const testTaleWithEnum = pgTable('test_tale_with_enum', {
//     id: serial('id').primaryKey(),
//     name: varchar('name', { length: 255 }).notNull().$type<TRole>(),
//     mailConfirmationStatus: moodEnum()
// });




export namespace TSchemaUser {
    export type TTblUserSelect = typeof tblUser.$inferSelect;
    export type TTblUserInsert = typeof tblUser.$inferInsert;

    // export type TTblRoleSelect = typeof tblRole.$inferSelect;
    // export type TTblRoleInsert = typeof tblRole.$inferInsert;

    export type TTblMailConfirmationStatusSelect = typeof tblMailConfirmationStatus.$inferSelect;
    export type TTblMailConfirmationStatusInsert = typeof tblMailConfirmationStatus.$inferInsert;

    export type TTblRolePermissionSelect = typeof tblRolePermission.$inferSelect;
    export type TTblRolePermissionInsert = typeof tblRolePermission.$inferInsert;



    export type TCreateBulkRolePermissionInput = {
        roleId: number
        permissionIds: number[]
    }
}




