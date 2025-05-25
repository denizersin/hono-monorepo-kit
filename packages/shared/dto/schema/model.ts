import { TModel } from '#/types/index';
import { boolean, float, int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const tblAiModel = mysqlTable('ai-model', {

    id: int().primaryKey().autoincrement(),
    name: varchar({length: 255}).notNull().$type<TModel>(),
    fullName: varchar({length: 255}).notNull(),
    isHaveReasoning: boolean().$default(() => false),
    oneMillionInputPrice: float().notNull(),
    oneMillionOutputPrice: float().notNull(), 
    oneMillionReasoningOutputPrice: float().$default(() => 0),
    score: int().notNull(),
    order: int().default(0),
    featuredText: varchar({length: 255}),
    commission: float().notNull(),
    isActive: boolean().$default(() => true),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().$onUpdate(() => new Date()),

})


namespace TSchemaAiModel {
    export const TTblAiModel = tblAiModel
    export type TTblAiModelInsert = typeof tblAiModel.$inferInsert
}

export default TSchemaAiModel