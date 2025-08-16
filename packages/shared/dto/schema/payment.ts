import { integer, pgTable } from "drizzle-orm/pg-core";
import { tblUser } from "./user";

export const tblPayment = pgTable('payment', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    userId: integer('user_id').notNull().references(() => tblUser.id),
    paidPrice: integer('paid_price').notNull()
})

