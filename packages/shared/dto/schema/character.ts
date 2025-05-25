import { int, json, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const tblCharacter = mysqlTable('character', {
    id: int().primaryKey().autoincrement(),
    name: varchar({length: 255}).notNull(),
    imageUrl: varchar({length: 255}).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().$onUpdate(() => new Date()),
    adminInstruction: text().notNull(),
    userInstruction: text(),
    exampleUserInstructions: json().$type<string[]>().notNull().default([]),
})


namespace TSchemaCharacter {
    export const TTblCharacter = tblCharacter
    export type TTblCharacterInsert = typeof tblCharacter.$inferInsert
}

export default TSchemaCharacter