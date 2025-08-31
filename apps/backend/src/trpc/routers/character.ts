import { SahredEnums } from "@repo/shared/enums";
import { adminProcedure, createTRPCRouter, protectedProcedure, roleMiddleware } from "../init";
import { characterValidator } from "@repo/shared/validators";
import { characterService } from "@server/bootstrap";

export const characterRouter = createTRPCRouter({

    createPersonaWithTranslation: adminProcedure
        .input(characterValidator.createPersonaWithTranslationSchema).mutation(async ({ ctx, input }) => {
            return await characterService.createPersonaWithTranslation(input)
        }),

    updatePersonaWithTranslation: adminProcedure
        .input(characterValidator.updatePersonaFormSchema).mutation(async ({ ctx, input }) => {
            return await characterService.updatePersonaWithTranslation(input)
        }),


    createCharacterWithRelations: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(characterValidator.createCharacterWithRelationsSchema).mutation(async ({ ctx, input }) => {
            return await characterService.createCharacterWithRelations(input)
        }),

    updateCharacterWithRelations: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(characterValidator.updateCharacterWithRelationsSchema).mutation(async ({ ctx, input }) => {
            return await characterService.updateCharacterWithRelations(input)
        }),

})