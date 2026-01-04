import { countryRepository, languageRepository } from "@server/bootstrap"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init"

export const constantsRouter = createTRPCRouter({
    getCountries: publicProcedure.query(async () => {
        return await countryRepository.getCountries()
    }),
    getLanguages: publicProcedure.query(async () => {
        return await languageRepository.getLanguages()
    }),
    getCompanyLanguages: protectedProcedure.query(async ({ ctx }) => {
        return await languageRepository.getCompanyLanguages({ companyId: ctx.session.companyId })
    })
})