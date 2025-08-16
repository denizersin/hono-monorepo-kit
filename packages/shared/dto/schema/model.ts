import { TModel } from '#/types/index';
import { boolean, doublePrecision, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';


export const tblAiModel = pgTable('ai-model', {

    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }).notNull().$type<TModel>(),
    fullName: varchar({ length: 255 }).notNull(),
    isHaveReasoning: boolean().$default(() => false),
    oneMillionInputPrice: doublePrecision().notNull(),
    oneMillionOutputPrice: doublePrecision().notNull(),
    oneMillionReasoningOutputPrice: doublePrecision().$default(() => 0),
    score: integer().notNull(),
    order: integer().default(0),
    featuredText: varchar({ length: 255 }),
    commission: doublePrecision().notNull(),
    isActive: boolean().$default(() => true),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().$onUpdate(() => new Date()),

})


namespace TSchemaAiModel {
    export type TTblAiModel = typeof tblAiModel.$inferSelect
    export type TTblAiModelInsert = typeof tblAiModel.$inferInsert
}

export default TSchemaAiModel