import { float, int, mysqlTable } from "drizzle-orm/mysql-core";
import { boolean, timestamp, varchar } from "drizzle-orm/mysql-core";

export const tblCoupon = mysqlTable('coupon', {
    id: int('id').primaryKey().autoincrement(),
    code: varchar('code', { length: 255 }).notNull(),
    price: float('price').notNull(),
    discount: int('discount'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
})


export type TTblCoupon = typeof tblCoupon.$inferSelect
export type TTblCouponInsert = typeof tblCoupon.$inferInsert

