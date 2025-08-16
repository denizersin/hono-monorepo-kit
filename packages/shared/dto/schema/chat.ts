import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { tblCharacter } from './character';
import { tblAiModel } from './model';
import { getDefaultTableFields, getDefaultTableFieldsWithDeletedAt } from './schemaHelpers';
import { tblUser } from './user';
import { SahredEnums } from '#/enums/index';
import { tblCountry } from './data';

export const tblPrivateChat = pgTable('private-chat', {

    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: integer().notNull().references(() => tblUser.id),
    recipientFullPhoneNumber: varchar({ length: 255 }).notNull(),

    modelId: integer().notNull().references(() => tblAiModel.id),
    characterId: integer().references(() => tblCharacter.id),
    promptTokens: integer().notNull().default(0),
    completionTokens: integer().notNull().default(0),
    totalTokens: integer().notNull().default(0),
    chatLanguageId: integer().references(() => tblCountry.id),
    ...getDefaultTableFieldsWithDeletedAt(),
})

export const tblPrivateChatMessages = pgTable('private-chat-messages', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    privateChatId: integer().references(() => tblPrivateChat.id),
    messageId: integer().references(() => tblMessageTable.id),

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


export const tblMessageTable = pgTable('message', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
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

export const tblGroupChat = pgTable('group-chat', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: integer().notNull().references(() => tblUser.id),


    modelId: integer().notNull().references(() => tblAiModel.id),
    characterId: integer().references(() => tblCharacter.id),
    promptTokens: integer().notNull().default(0),
    completionTokens: integer().notNull().default(0),
    totalTokens: integer().notNull().default(0),

    ...getDefaultTableFieldsWithDeletedAt(),

})

export const tblGroupChatMessages = pgTable('group-chat-messages', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    groupChatId: integer().references(() => tblGroupChat.id),
    messageId: integer().references(() => tblMessageTable.id),

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







