import { doublePrecision, integer, pgTable } from "drizzle-orm/pg-core";
import { boolean, timestamp, varchar } from "drizzle-orm/pg-core";

export const tblCoupon = pgTable('coupon', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    code: varchar('code', { length: 255 }).notNull(),
    price: doublePrecision('price').notNull(),
    discount: integer('discount'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
})


export type TTblCoupon = typeof tblCoupon.$inferSelect
export type TTblCouponInsert = typeof tblCoupon.$inferInsert

