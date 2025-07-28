import { relations } from 'drizzle-orm';
import { boolean, int, mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { tblCharacter } from './character';
import { tblAiModel } from './model';
import { getDefaultTableFields, getDefaultTableFieldsWithDeletedAt } from './schemaHelpers';
import { tblUser } from './user';
import { SahredEnums } from '#/enums/index';
import { tblCountry } from './data';

export const tblPrivateChat = mysqlTable('private-chat', {

    id: int().primaryKey().autoincrement(),
    userId: int().notNull().references(() => tblUser.id),
    recipientFullPhoneNumber: varchar({ length: 255 }).notNull(),

    modelId: int().notNull().references(() => tblAiModel.id),
    characterId: int().references(() => tblCharacter.id),
    promptTokens: int().notNull().default(0),
    completionTokens: int().notNull().default(0),
    totalTokens: int().notNull().default(0),
    chatLanguageId: int().references(() => tblCountry.id),
    ...getDefaultTableFieldsWithDeletedAt(),
})

export const tblPrivateChatMessages = mysqlTable('private-chat-messages', {
    id: int().primaryKey().autoincrement(),
    privateChatId: int().references(() => tblPrivateChat.id),
    messageId: int().references(() => tblMessageTable.id),

    ...getDefaultTableFieldsWithDeletedAt(),
})

export const tblPrivateChatMessagesRelation = relations(tblPrivateChatMessages, ({ one }) => ({
    privateChat: one(tblPrivateChat, {
        fields: [tblPrivateChatMessages.privateChatId],
        references: [tblPrivateChat.id]
    }),
    message: one(tblMessageTable, {
        fields: [tblPrivateChatMessages.messageId],
        references: [tblMessageTable.id]
    })
}))


export const tblMessageTable = mysqlTable('message', {
    id: int().primaryKey().autoincrement(),
    isManualWithPrompt: boolean().$default(() => false),
    imageBase64: text(),
    message: text().notNull(),

    ...getDefaultTableFields()
})



export const tblPrivateChatRelation = relations(tblPrivateChat, ({ many, one }) => ({
    messages: many(tblPrivateChatMessages),
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

    ...getDefaultTableFieldsWithDeletedAt(),

})

export const tblGroupChatMessages = mysqlTable('group-chat-messages', {
    id: int().primaryKey().autoincrement(),
    groupChatId: int().references(() => tblGroupChat.id),
    messageId: int().references(() => tblMessageTable.id),

    ...getDefaultTableFieldsWithDeletedAt(),
})


export const tblGroupChatMessagesRelation = relations(tblGroupChatMessages, ({ one }) => ({

    groupChat: one(tblGroupChat, {
        fields: [tblGroupChatMessages.groupChatId],
        references: [tblGroupChat.id]
    }),
    message: one(tblMessageTable, {
        fields: [tblGroupChatMessages.messageId],
        references: [tblMessageTable.id]
    })
}))

export const tblGroupChatRelations = relations(tblGroupChat, ({ many, one }) => ({
    messages: many(tblGroupChatMessages),
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







