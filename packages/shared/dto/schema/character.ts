import { relations } from 'drizzle-orm';
import { boolean, doublePrecision, foreignKey, integer, pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { tblLanguage } from './data';
import { getDefaultTableFieldsWithDeletedAt } from './schemaHelpers';
import { mockDb, ReturnTypeOfQuery } from './type';



 
export const tblCharacter = pgTable('character', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),

    //data
    name: varchar({ length: 255 }).notNull(),
    imageUrl: varchar({ length: 255 }),
    //relations
    mainPersonaId: integer().notNull().references(() => tblPersona.id),


    //timestamps
    ...getDefaultTableFieldsWithDeletedAt()
})

// Relation definitions relying on tables declared above are placed after all table declarations to avoid any temporal-dead-zone issues.
// (Declaration will be re-added further below)

export const tblCharacterInstruction = pgTable('character-instruction', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),

    //data
    rating: doublePrecision(),
    order: integer(),
    isActive: boolean().notNull().default(true),
    isAdminInstruction: boolean().notNull().default(false),
    //relations
    characterId: integer().notNull().references(() => tblCharacter.id, { onDelete: 'cascade' }),

    //timestamps
    ...getDefaultTableFieldsWithDeletedAt()
})

export const tblCharacterInstructionRelation = relations(tblCharacterInstruction, ({ one, many }) => ({
    character: one(tblCharacter, {
        fields: [tblCharacterInstruction.characterId],
        references: [tblCharacter.id],
    }),
    translations: many(tblCharacterInstructionTranslation),
}))

export const tblCharacterInstructionTranslation = pgTable(
    'character-instruction-translation',
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity(),
        characterInstructionId: integer().notNull(),
        languageId: integer().notNull(),
        //timestamps
        ...getDefaultTableFieldsWithDeletedAt()
    },
    (table) => ({
        // FK to character-instruction  (short name keeps us < 64 chars)
        fkCharInstrTransInstr: foreignKey({
            columns: [table.characterInstructionId],
            foreignColumns: [tblCharacterInstruction.id],
            name: 'fk_char_instr_trans_instr',   // ≤ 64 chars
        }).onDelete('cascade'),

        // FK to language
        fkCharInstrTransLang: foreignKey({
            columns: [table.languageId],
            foreignColumns: [tblLanguage.id],
            name: 'fk_char_instr_trans_lang',
        }),
    }),

);

export const tblCharacterInstructionTranslationRelation = relations(tblCharacterInstructionTranslation, ({ one }) => ({
    characterInstruction: one(tblCharacterInstruction, {
        fields: [tblCharacterInstructionTranslation.characterInstructionId],
        references: [tblCharacterInstruction.id],
    }),
    language: one(tblLanguage, {
        fields: [tblCharacterInstructionTranslation.languageId],
        references: [tblLanguage.id],
    }),
}))


export const tblCharacterImage = pgTable('character-image', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),


    //data
    imageUrl: varchar({ length: 255 }).notNull(),
    width: integer(),
    height: integer(),
    //relations
    characterId: integer().notNull().references(() => tblCharacter.id, { onDelete: 'cascade' }),

    //timestamps
    ...getDefaultTableFieldsWithDeletedAt()
})

export const tblCharacterImageRelation = relations(tblCharacterImage, ({ one }) => ({
    character: one(tblCharacter, {
        fields: [tblCharacterImage.characterId],
        references: [tblCharacter.id],
    }),
}))

export const tblCharacterPersona = pgTable('character-persona', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    characterId: integer().notNull().references(() => tblCharacter.id, { onDelete: 'cascade' }),
    personaId: integer().notNull().references(() => tblPersona.id, { onDelete: 'cascade' }),

    //timestamps
    ...getDefaultTableFieldsWithDeletedAt()
})

export const tblCharacterPersonaRelation = relations(tblCharacterPersona, ({ one }) => ({
    character: one(tblCharacter, {
        fields: [tblCharacterPersona.characterId],
        references: [tblCharacter.id],
    }),
    persona: one(tblPersona, {
        fields: [tblCharacterPersona.personaId],
        references: [tblPersona.id],
    }),
}))





export const tblPersona = pgTable('persona', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),

    //data
    name: varchar({ length: 255 }).notNull(),
    imageUrl: varchar({ length: 255 }),
    icon: varchar({ length: 255 }),

    //timestamps
    ...getDefaultTableFieldsWithDeletedAt()
})



export const tblPersonaTranslation = pgTable('persona-translation', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),

    //data
    personaId: integer().notNull().references(() => tblPersona.id, { onDelete: 'cascade' }),
    languageId: integer().notNull().references(() => tblLanguage.id, { onDelete: 'cascade' }),
    name: varchar({ length: 255 }).notNull(),

    //timestamps
    ...getDefaultTableFieldsWithDeletedAt()
},(table) => ({
    unique_persona_language: uniqueIndex('unique_persona_language').on(table.personaId, table.languageId)
}))


export const tblPersonaRelation = relations(tblPersona, ({ many }) => ({
    translations: many(tblPersonaTranslation),
}))

export const tblPersonaTranslationRelation = relations(tblPersonaTranslation, ({ one }) => ({
    persona: one(tblPersona, {
        fields: [tblPersonaTranslation.personaId],
        references: [tblPersona.id],
    }),
    language: one(tblLanguage, {
        fields: [tblPersonaTranslation.languageId],
        references: [tblLanguage.id],
    }),
}))

// -----------------------------------------------------------------------------
// Character relations (requires all tables above to be defined)
// -----------------------------------------------------------------------------

export const tblCharacterRelation = relations(tblCharacter, ({ one, many }) => ({
    mainPersona: one(tblPersona, {
        fields: [tblCharacter.mainPersonaId],
        references: [tblPersona.id],
    }),
    personas: many(tblCharacterPersona),
    instructions: many(tblCharacterInstruction),
    images: many(tblCharacterImage),
}));

//relations
//tblCharacter m -> m  tblCharacterPersona o -> o tblPersona o -> m tblPersonaTranslation
//tblCharacter o-> m tblCharacterInstruction o-> m tblCharacterInstructionTranslation
//tblCharacter o->m tblCharacterImage

export namespace TSchemaCharacter {


    // ** step1: define all tables select and insert types **
    export type TCharacter = typeof tblCharacter.$inferSelect
    export type TCharacterInsert = typeof tblCharacter.$inferInsert

    export type TCharacterInstruction = typeof tblCharacterInstruction.$inferSelect
    export type TCharacterInstructionInsert = typeof tblCharacterInstruction.$inferInsert

    export type TCharacterInstructionTranslation = typeof tblCharacterInstructionTranslation.$inferSelect
    export type TCharacterInstructionTranslationInsert = typeof tblCharacterInstructionTranslation.$inferInsert

    export type TCharacterImage = typeof tblCharacterImage.$inferSelect
    export type TCharacterImageInsert = typeof tblCharacterImage.$inferInsert

    export type TPersona = typeof tblPersona.$inferSelect
    export type TPersonaInsert = typeof tblPersona.$inferInsert

    export type TPersonaTranslation = typeof tblPersonaTranslation.$inferSelect
    export type TPersonaTranslationInsert = typeof tblPersonaTranslation.$inferInsert

    export type TCharacterPersona = typeof tblCharacterPersona.$inferSelect
    export type TCharacterPersonaInsert = typeof tblCharacterPersona.$inferInsert
    // ** step1: define all tables select and insert types **


 


    export namespace TCharacterRepositoryTypes {

        
        //detailed types for repository function's props and return types
        // ** step2: types for create and update **
        export type TCreatePersonaWithTranslation = {
            personaData: TPersonaInsert
            translations: Omit<TPersonaTranslationInsert, 'personaId'>[]
        }

        export type TUpdatePersonaWithTranslation = {
            id: number
            data: {
                personaData: TPersonaInsert
                translations: TPersonaTranslationInsert[]
            }
        }


        export type TCreateCharacterInstruction = {
            characterInstructionData: TCharacterInstructionInsert
            translations: Omit<TCharacterInstructionTranslationInsert, 'characterInstructionId'>[]
        }

        export type TUpdateCharacterInstruction = {
            id: number
            data: {
                characterInstructionData: Partial<TCharacterInstructionInsert>
                translations?: Partial<TCharacterInstructionTranslationInsert>[]
            }
        }



        export type TUpdateCharacterImage = {
            id: number
            data: {
                characterImageData: Partial<TCharacterImageInsert>
            }
        }

        export type TCreateCharacterImage = TCharacterImageInsert

        export type TCreateCharacterWithRelations = {
            characterData: TCharacterInsert
            personaIds?: number[] //many to many
            instructions?: Array<{
                characterInstructionData: Omit<TCharacterInstructionInsert, 'characterId'>
                translations: Omit<TCharacterInstructionTranslationInsert, 'characterInstructionId'>[]
            }> //one to many
            images?: Array<{ characterImageData: Omit<TCharacterImageInsert, 'characterId'> }> //one to many
        }

        export type TUpdateCharacterWithRelations = {
            id: number
            data: {
                characterData?: Partial<TCharacterInsert>
                personaIds?: number[] //many to many
            }
        }
        // ** step2: types for create and update **






        // ** step3: select types that have relations (for repository functions) **
        export type TCharacterWithRelations = ReturnTypeOfQuery<typeof getCharacterWithRelations>

        export type TPersonaWithTranslations = ReturnTypeOfQuery<typeof getPersonasWithTranslations>
        // ** step3: select types that have relations (for repository functions) **


    }


}



function getCharacterWithRelations() {
    return mockDb.query.tblCharacter.findFirst({
        with: {
            personas: {
                with: {
                    persona: {
                        with: {
                            translations: true
                        }
                    }
                }
            },
            images: true,
            instructions: {
                with: {

                }
            },
            // mainPersona: true
        }
    })
}


function getPersonasWithTranslations() {
    return mockDb.query.tblPersona.findFirst({
        with: {
            translations: true
        }
    })
}

