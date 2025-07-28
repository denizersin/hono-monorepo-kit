import { boolean, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const tblLog = mysqlTable('log', {
    id: int().primaryKey().autoincrement(),
    eventId: int().notNull(),
    eventName: varchar({ length: 255 }).notNull(),
    eventData: json(),
    createdAt: timestamp().notNull().defaultNow(),
    
})



export const tblLogStatus = mysqlTable('log-status', {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
})


