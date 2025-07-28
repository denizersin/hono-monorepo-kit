import { createInsertSchema } from "drizzle-zod";
import { tblCharacter, tblCharacterImage, tblCharacterInstruction, tblCharacterInstructionTranslation, tblCharacterPersona, tblPersona, tblPersonaTranslation } from "../../schema";
import { z } from "zod";



const personaBaseInsertSchema = createInsertSchema(tblPersona).pick({
    icon: true,
    imageUrl: true,
    name: true,
})
const personaTranslationBaseInsertSchema = createInsertSchema(tblPersonaTranslation).pick({
    languageId: true,
    name: true,
})
const characterBaseInsertSchema = createInsertSchema(tblCharacter).pick({
    imageUrl: true,
    mainPersonaId: true,
    name: true,
})
const characterInstructionBaseInsertSchema = createInsertSchema(tblCharacterInstruction).pick({
    characterId: true,
    isActive: true,
    isAdminInstruction: true,
    order: true,
    rating: true,
})
const characterInstructionTranslationBaseInsertSchema = createInsertSchema(tblCharacterInstructionTranslation).pick({
    characterInstructionId: true,
    languageId: true,
})
const characterImageBaseInsertSchema = createInsertSchema(tblCharacterImage).pick({
    characterId: true,
    height: true,
    imageUrl: true,
    width: true,
})

const characterPersonaBaseInsertSchema = createInsertSchema(tblCharacterPersona).pick({
    characterId: true,
    personaId: true,
})





const createPersonaWithTranslationSchema=z.object({
    personaData: personaBaseInsertSchema,
    translations: z.array(personaTranslationBaseInsertSchema),
})

const updatePersonaFormSchema=z.object({
    id: z.number(),
    data: z.object({
        personaData: personaBaseInsertSchema.partial(),
        translations: z.array(personaTranslationBaseInsertSchema.partial()),
    }),
})



const createCharacterInstructionWithTranslationSchema=z.object({
    characterInstructionData: characterInstructionBaseInsertSchema,
    translations: z.array(characterInstructionTranslationBaseInsertSchema.omit({
        characterInstructionId: true,
    })),
})

const updateCharacterInstructionWithTranslationSchema=z.object({
    id: z.number(),
    data: z.object({
        characterInstructionData: characterInstructionBaseInsertSchema.partial(),
        translations: z.array(characterInstructionTranslationBaseInsertSchema.partial()),
    }),
})

const createCharacterImageSchema=z.object({
    characterImageData: characterImageBaseInsertSchema,
})

const updateCharacterImageSchema=z.object({
    id: z.number(),
    data: z.object({
        characterImageData: characterImageBaseInsertSchema.partial(),
    }),
})

const createCharacterSchema=z.object({
    characterData: characterBaseInsertSchema,
    personaIds: z.array(z.number()),
    instructions: z.array(createCharacterInstructionWithTranslationSchema),
    images: z.array(createCharacterImageSchema),
})

const updateCharacterSchema=z.object({
    id: z.number(),
    data: z.object({
        characterData: characterBaseInsertSchema.partial(),
        personaIds: z.array(z.number()),
    }),
})






export const characterValidator = {
    createPersonaWithTranslationSchema,
    updatePersonaFormSchema,
    createCharacterInstructionWithTranslationSchema,
    updateCharacterInstructionWithTranslationSchema,
    createCharacterImageSchema,
    updateCharacterImageSchema,
    createCharacterSchema,
    updateCharacterSchema,
}




export namespace TCharacterValidator {
    export type TCharacterInsert = z.infer<typeof characterBaseInsertSchema>
    export type TCreatePersonaWithTranslation = z.infer<typeof createPersonaWithTranslationSchema>
    export type TUpdatePersonaForm = z.infer<typeof updatePersonaFormSchema>
    export type TCreateCharacterInstructionWithTranslation = z.infer<typeof createCharacterInstructionWithTranslationSchema>
    export type TUpdateCharacterInstructionWithTranslation = z.infer<typeof updateCharacterInstructionWithTranslationSchema>
    export type TCreateCharacterImage = z.infer<typeof createCharacterImageSchema>
    export type TUpdateCharacterImage = z.infer<typeof updateCharacterImageSchema>
    export type TCreateCharacter = z.infer<typeof createCharacterSchema>
    export type TUpdateCharacter = z.infer<typeof updateCharacterSchema>
}






