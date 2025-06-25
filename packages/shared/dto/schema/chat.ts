import { TChatType } from '#/types/index';
import { relations } from 'drizzle-orm';
import { boolean, int, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { tblAiModel } from './model';
import { tblCharacter } from './character';
import { tblUser } from './user';

export const tblPrivateChat = mysqlTable('private-chat', {

    id: int().primaryKey().autoincrement(),
    userId: int().notNull().references(() => tblUser.id),
    recipientFullPhoneNumber: varchar({ length: 255 }).notNull(),

    modelId: int().notNull().references(() => tblAiModel.id),
    characterId: int().references(() => tblCharacter.id),
    promptTokens: int().notNull().default(0),
    completionTokens: int().notNull().default(0),
    totalTokens: int().notNull().default(0),

    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().$onUpdate(() => new Date()),

})

export const tblMessageTable = mysqlTable('message', {
    id: int().primaryKey().autoincrement(),
    chatId: int().references(() => tblPrivateChat.id),
    isManualWithPrompt: boolean().$default(() => false),
    imageBase64: text(),
    message: text().notNull(),
})



export const tblPrivateChatRelation = relations(tblPrivateChat, ({ many, one }) => ({
    messages: many(tblMessageTable),
    user: one(tblUser, {
        fields: [tblPrivateChat.userId],
        references: [tblUser.id]
    }),
    model: one(tblAiModel, {
        fields: [tblPrivateChat.modelId],
        references: [tblAiModel.id]
    }),
    character: one(tblCharacter, {
        fields: [tblPrivateChat.characterId],
        references: [tblCharacter.id]
    }),


}))

export const tblGroupChat = mysqlTable('group-chat', {
    id: int().primaryKey().autoincrement(),
    userId: int().notNull().references(() => tblUser.id),


    modelId: int().notNull().references(() => tblAiModel.id),
    characterId: int().references(() => tblCharacter.id),
    promptTokens: int().notNull().default(0),
    completionTokens: int().notNull().default(0),
    totalTokens: int().notNull().default(0),

    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().$onUpdate(() => new Date()),


})


export const tblGroupChatRelations = relations(tblGroupChat, ({ many, one }) => ({
    messages: many(tblMessageTable),
    user: one(tblUser, {
        fields: [tblGroupChat.userId],
        references: [tblUser.id]
    }),
    model: one(tblAiModel, {
        fields: [tblGroupChat.modelId],
        references: [tblAiModel.id]
    }),
    character: one(tblCharacter, {
        fields: [tblGroupChat.characterId],
        references: [tblCharacter.id]
    }),

}))







export const tblChatType = mysqlTable('chat-type', {

    id: int().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull().unique().$type<TChatType>(),

})

