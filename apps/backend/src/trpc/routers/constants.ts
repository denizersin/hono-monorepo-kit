import { countryRepository, languageRepository } from "@server/bootstrap"
import { createTRPCRouter, publicProcedure } from "../init"

export const constantsRouter = createTRPCRouter({
    getCountries: publicProcedure.query(async () => {
        return await countryRepository.getCountries()
    }),
    getLanguages: publicProcedure.query(async () => {
        return await languageRepository.getLanguages()
    })
})