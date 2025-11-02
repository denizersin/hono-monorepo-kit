import { createInsertSchema } from "drizzle-zod";
import { tblCharacter, tblCharacterImage, tblCharacterInstruction, tblCharacterInstructionTranslation, tblCharacterPersona, tblPersona, tblPersonaTranslation } from "../../schema";
import { z } from "zod";
import { defaultOmitFieldsSchema } from "../utils";
import { basePaginationQuerySchema } from "../utils";
import { TSchemaCharacter } from "../../schema";







//base insert zod schemas
const personaBaseInsertSchema = createInsertSchema(tblPersona).omit(defaultOmitFieldsSchema)

const personaTranslationBaseInsertSchema = createInsertSchema(tblPersonaTranslation).omit(defaultOmitFieldsSchema);

const characterBaseInsertSchema = createInsertSchema(tblCharacter).omit(defaultOmitFieldsSchema)
const characterInstructionBaseInsertSchema = createInsertSchema(tblCharacterInstruction).omit(defaultOmitFieldsSchema)

const characterInstructionTranslationBaseInsertSchema = createInsertSchema(tblCharacterInstructionTranslation).omit(defaultOmitFieldsSchema)

const characterImageBaseInsertSchema = createInsertSchema(tblCharacterImage).omit(defaultOmitFieldsSchema)







//crud schemas with relations
const createPersonaWithTranslationSchema = z.object({
    personaData: personaBaseInsertSchema,
    translations: z.array(personaTranslationBaseInsertSchema.pick({
        name: true,
        languageId: true,
    })),
})

const updatePersonaFormSchema = z.object({
    id: z.number(),
    data: z.object({
        personaData: personaBaseInsertSchema,
        // Allow updating existing translations by id
        translations: z.array(personaTranslationBaseInsertSchema),
    }),
})



const createCharacterInstructionWithTranslationSchema = z.object({
    characterInstructionData: characterInstructionBaseInsertSchema,
    translations: z.array(characterInstructionTranslationBaseInsertSchema.omit({
        characterInstructionId: true,
    })),
})

const updateCharacterInstructionWithTranslationSchema = z.object({
    id: z.number(),
    data: z.object({
        characterInstructionData: characterInstructionBaseInsertSchema.partial(),
        translations: z.array(characterInstructionTranslationBaseInsertSchema.partial()),
    }),
})

const createCharacterImageSchema = z.object({
    characterImageData: characterImageBaseInsertSchema,
})

const updateCharacterImageSchema = z.object({
    id: z.number(),
    data: z.object({
        characterImageData: characterImageBaseInsertSchema.partial(),
    }),
})

const createCharacterWithRelationsSchema = z.object({
    characterData: characterBaseInsertSchema,
    personaIds: z.array(z.number()),
    instructions: z.array(createCharacterInstructionWithTranslationSchema),
    images: z.array(createCharacterImageSchema),
})

const updateCharacterWithRelationsSchema = z.object({
    id: z.number(),
    data: z.object({
        characterData: characterBaseInsertSchema.partial(),
        personaIds: z.array(z.number()),
    }),
})




//query schemas




type TSortKeys = (keyof Pick<TSchemaCharacter.TPersona, 'name' | 'createdAt'>)
const personaPaginationSortFields = ['name', 'createdAt'] as TSortKeys[]


const personaPaginationQuerySchema = basePaginationQuerySchema.extend({
    sort: z.array(z.object({
        sortBy: z.enum(['asc', 'desc']),
        sortField: z.enum(personaPaginationSortFields as [TSortKeys, ...TSortKeys[]]),
    })),
    filter: z.object({
        name: z.string().optional(),
    })
})







export const characterValidator = {
    createPersonaWithTranslationSchema,
    updatePersonaFormSchema,
    createCharacterInstructionWithTranslationSchema,
    updateCharacterInstructionWithTranslationSchema,
    createCharacterImageSchema,
    updateCharacterImageSchema,
    createCharacterWithRelationsSchema,
    updateCharacterWithRelationsSchema,




    //query schemas
    personaPaginationQuerySchema,
}




export namespace TCharacterValidator {
    export type TCharacterInsert = z.infer<typeof characterBaseInsertSchema>
    export type TCreatePersonaWithTranslation = z.infer<typeof createPersonaWithTranslationSchema>
    export type TUpdatePersonaForm = z.infer<typeof updatePersonaFormSchema>
    export type TCreateCharacterInstructionWithTranslation = z.infer<typeof createCharacterInstructionWithTranslationSchema>
    export type TUpdateCharacterInstructionWithTranslation = z.infer<typeof updateCharacterInstructionWithTranslationSchema>
    export type TCreateCharacterImage = z.infer<typeof createCharacterImageSchema>
    export type TUpdateCharacterImage = z.infer<typeof updateCharacterImageSchema>
    export type TCreateCharacterWithRelations = z.infer<typeof createCharacterWithRelationsSchema>
    export type TUpdateCharacterWithRelations = z.infer<typeof updateCharacterWithRelationsSchema>

    //query schemas
    export type TPersonaPaginationQuery = z.infer<typeof personaPaginationQuerySchema>
    export type TPersonaPaginationQuerySortKeys=TSortKeys

    
}






