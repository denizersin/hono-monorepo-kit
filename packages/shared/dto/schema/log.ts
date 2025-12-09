import { integer, jsonb, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
export const tblLog = pgTable('log', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: integer().notNull(),
    eventName: varchar({ length: 255 }).notNull(),
    eventData: jsonb().$type(),
    createdAt: timestamp().notNull().defaultNow(),
    
})



export const tblLogStatus = pgTable('log-status', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
})


