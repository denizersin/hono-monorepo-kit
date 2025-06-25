import { createInsertSchema } from "drizzle-zod";
import { tblCharacter } from "../../schema";
import { z } from "zod";





const characterBaseInsertSchema = createInsertSchema(tblCharacter, {
    exampleUserInstructions: z.array(z.string()).default([]),
}).pick({
    adminInstruction: true,
    name: true,
    imageUrl: true,
    exampleUserInstructions: true,
    userInstruction: true,
})


const adminCreateCharacterSchema = characterBaseInsertSchema

const userCreateCharacterSchema = characterBaseInsertSchema.omit({
    exampleUserInstructions: true,
    adminInstruction: true,
})

export const characterValidator = {
    adminCreateCharacterSchema,
    userCreateCharacterSchema,
}




export namespace TCharacterValidator {
    export type TCharacterInsert = z.infer<typeof characterBaseInsertSchema>
    export type TAdminCreateCharacterSchema = z.infer<typeof adminCreateCharacterSchema>
    export type TUserCreateCharacterSchema = z.infer<typeof userCreateCharacterSchema>
}






