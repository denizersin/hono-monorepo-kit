import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { tblUser } from "./user";

export const tblPayment = mysqlTable('payment', {
    id: int('id').primaryKey().autoincrement(),
    userId: int('user_id').notNull().references(() => tblUser.id),
    paidPrice: int('paid_price').notNull()
})

