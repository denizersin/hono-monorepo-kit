import { companyValidator } from "@repo/shared/validators"
import { adminProcedure, createTRPCRouter, protectedProcedure, roleMiddleware } from "../init"
import { companyService } from "@server/bootstrap"
import { SahredEnums } from "@repo/shared/enums"


export const companyRouter = createTRPCRouter({
    createCompany: protectedProcedure.use(roleMiddleware([SahredEnums.Role.ADMIN, SahredEnums.Role.OWNER]))
        .input(companyValidator.companyBaseInsertSchema).mutation(async ({ ctx, input }) => {
            return await companyService.createCompany(input)
        })
})